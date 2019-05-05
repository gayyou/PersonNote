# 以一个例子为线索看看Vue是怎么进行初始化的

```vue
<div id="app">{{test}}</div>
```



```JavaScript
var vm = new Vue({
    el: '#app',
    data: {
        test: 1
    }
})
```

这段代码很简单，只是简单地构造了一个Vue对象并放入options设置值。以上的代码最终会在页面中渲染成以下的DOM：

```vue
<div id="app">1</div>
```

其中的test转成了1，如果此时将test的值改为2，那么会如何呢。

```JavaScript
vm.$data.test = 2
// 或
vm.test = 2
```

那么页面的 `DOM` 也会随之变化为：

```html
<div id="app">2</div>
```

这个看起来也没什么好说的，但是想一下内部是怎么进行实现的？

```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```

这个是Vue的构造函数，刚刚我们新建一个对象的时候，会传入一个对象，这个对象就是options对象，作为参数进行构建。会执行这个this._init(options);方法

那我们找一下这个init方法到底在哪里？

```js
const vm: Component = this
// a uid
vm._uid = uid++
```

这个是init方法一开始的两个逻辑语句，第一个vm即这个新建的vue对象，第二个的uid++，id就是在这个程序中每个vue对象独一无二的识别。

接下来看一下这串代码

```js
let startTag, endTag
/* istanbul ignore if */
if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    startTag = `vue-perf-start:${vm._uid}`
    endTag = `vue-perf-end:${vm._uid}`
    mark(startTag)
}

// 中间的代码省略...

/* istanbul ignore if */
if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    vm._name = formatComponentName(vm, false)
    mark(endTag)
    measure(`vue ${vm._name} init`, startTag, endTag)
}
```

省略中间的代码，看看这一句是什么？

```js
if (process.env.NODE_ENV !== 'production' && config.performance && mark)
```

这一句判断语句有三个需要进行判断的，第一个是非生产环境，即开发环境等。第二个是performance属性不为空，第三个是mark存在。

第一个判断条件很简单，只要不是生产条件就会去判断，那么第二个条件是怎么回事呢？

```js
/**
 * Whether to record perf
 * 是否记录性能
 */
performance: false,
```

这个是从config.js中抠出来的，标志着是否记录性能。

下面的代码是对这个vue对象进行初始化，可以在控制台输出的时候看到这个对象的这些属性。

```js
// a flag to avoid this being observed
// 避免被观察者对象观察
vm._isVue = true
// merge options
if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    initInternalComponent(vm, options)
} else {
    vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor),
    options || {},
    vm
    )
}
/* istanbul ignore else */
if (process.env.NODE_ENV !== 'production') {
    initProxy(vm)
} else {
    vm._renderProxy = vm
}
// expose real self
vm._self = vm
initLifecycle(vm)
initEvents(vm)
initRender(vm)
callHook(vm, 'beforeCreate')
initInjections(vm) // resolve injections before data/props
initState(vm)
initProvide(vm) // resolve provide after data/props
callHook(vm, 'created')
```

上面的代码是那两段性能追踪的代码之间全部的内容，我们逐一分析，首先在 `Vue` 实例上添加 `_isVue`属性，并设置其值为 `true`。目的是用来标识一个对象是 `Vue` 实例，即如果发现一个对象拥有 `_isVue`属性并且其值为 `true`，那么就代表该对象是 `Vue` 实例。这样可以避免该对象被响应系统观测（其实在其他地方也有用到，但是宗旨都是一样的，这个属性就是用来告诉你：我不是普通的对象，我是Vue实例）。

接下来是这一串代码：

```js
// merge options
if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    initInternalComponent(vm, options)
} else {
    vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
    )
}
```

上面的代码是一段 `if` 分支语句，条件是：`options && options._isComponent`，其中 `options` 就是我们调用 `Vue` 时传递的参数选项，但 `options._isComponent` 是什么鬼？我们知道在本节的例子中我们的 `options` 对象只有两个属性 `el` 和 `data`，并且在 `Vue` 的官方文档中你也找不到关于 `_isComponent`这个选项的介绍，其实我相信大部分同学都已经知道，这是一个内部选项。而事实也确实是这样，这个内部选项是在 `Vue` 创建组件的时候才会有的，为了不牵涉太多内容导致大家头晕，这里暂时不介绍其相关内容。

根据本节的例子，上面的代码必然会走 `else` 分支，也就是这段代码：

```js
vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor),
    options || {},
    vm
)
```

这段代码在 `Vue` 实例上添加了 `$options` 属性，在 `Vue` 的官方文档中，你能够查看到 `$options` 属性的作用，这个属性用于当前 `Vue` 的初始化，什么意思呢？大家要注意我们现在的阶段处于 `_init()`方法中，在 `_init()` 方法的内部大家可以看到一系列 `init*` 的方法，比如：

```js
initLifecycle(vm)
initEvents(vm)
initRender(vm)
callHook(vm, 'beforeCreate')
initInjections(vm) // resolve injections before data/props
initState(vm)
initProvide(vm) // resolve provide after data/props
callHook(vm, 'created')
```

