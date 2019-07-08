# Vue之数据响应系统

## 实例对象代理访问数据data

在目录的/core/instance/state.js下面有个initState方法里面，有对props、methods等等的数据响应初始化，我们先对data的数据响应进行理解。

```js
function initData (vm: Component) {
  // 在选项和并的时候，我们就已经将data设为一个函数的了
  let data = vm.$options.data
  // 判断data是否是个函数，如果是函数的话就执行得到返回值
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    // 如果data并不是一个JSON格式的对象，那么就会报错
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      // 进行校错，如果data里面存在着跟method和props同样名称的，则会进行报错
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      // 如果不是保留的，就是以_或者$开头的属性，进行代理
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  // 进行观察对象
  observe(data, true /* asRootData */)
}
```

这段代码的首先我们会接触到以下这串代码

```js
let data = vm.$options.data
data = vm._data = typeof data === 'function'
  ? getData(data, vm)
  : data || {}
```

这里的`data`就是我们选项合并时候所说的data，在选项合并`mergeOptions`的时候会被处理成一个函数，但是为什么这里还要进行判断它是否是个函数？原因是在`initState`被调用之前，还有一个叫做`callHook`里面回调了`beforeCreate`这个生命周期钩子，如果开发者在那里对`data`这个选项进行了修改，而在这里没有进行监测就直接认为是一个函数的话，那么这个错误开发者也就没有发现了。所以这里很有必要进行类型的判断。

```js
if (!isPlainObject(data)) {
    // 如果data并不是一个JSON格式的对象，那么就会报错
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
 }
```

这里是对于执行结果的判断，如果data选项里面并不是一个`JSON`格式的对象的话，那`Vue`就会对用户提出警告。其中，`getData`这个函数就是对这个`data`选项进行执行处理，并且会有在出错的时候进行报错。

接下来就是进行检验用户对于属性方法的命名空间了

```js
// proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      // 进行校错，如果data里面存在着跟method和props同样名称的，则会进行报错
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      // 如果不是保留的，就是以_或者$开头的属性，进行代理
      proxy(vm, `_data`, key)
    }
  }
```

首先会获取`data`的所有键名，进行遍历并且看这些属性名是否在`props`或者`methods`中出现过，如果出现了则会进行报错。

为什么要进行监测呢？这是因为`Vue`实例对象中第一层就可以直接访问属性和方法还有传参，如果一样的话就会产生命名空间的冲突，这里是为了防止命名空间冲突。

最后我们看到这断代码

```js
else if (!isReserved(key)) {
  // 如果不是保留的，就是以_或者$开头的属性，进行代理
  proxy(vm, `_data`, key)
}
```

这里就进行数据代理，如果不是Vue对象中的保留属性的格式（$或_）开头的，那么就会进行代理访问。这是因为以这两个符号开头的是`vue`的保留属性。下面就是代理函数的代码：

```js
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    // 返回vm._data[key]
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    // 设置vm._data
    this[sourceKey][key] = val
  }
  // 访问vm里面的数据的时候会代理到vm._data里面
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

上面是进行`data`数据的代理，所以是将`_data`里面的数据代理到`Vue`对象中，从而方便操作。

 接下来就是对变量进行观察：

```js
observe(data, true /* asRootData */)
```

可以说观察者才是数据响应系统的开始。在进行分析观察者之前，我们对前面的进行总结

- 首先获取`data`，`data`是在选项合并的时候合成的一个函数，现在要执行这个函数来获取数据，但是我们要先对data的类型进行检查，因为在进行`data`的初始化之前我们会回调一次`vue`的生命周期，这也是`vue`的生命周期中`beforeCreate`，开发者有可能对这个`$data`对象进行修改，修改成其他类型。
- 其次我们会`data`执行结果进行类型的检测，如果不是`JSON`格式的话，会进行报错。
- 再者会进行检验`data`、`props`、`methods`的命名是否重复了，如果重复的情况下会进行报错
- 接下来是对非保留属性的`data`属性进行代理，将`_data`里面的属性代理到`vm`中，这样我们可以从`vm`直接访问到`vm._data`里面的属性。保留属性就是以_或者$开头的属性。
- 接下来就是进行观察数据了。

****

## 响应系统的基本思路

接下来就是数据响应的基本思路，我们先看一下下面的例子：

在`Vue`对象中，我们可以使用`$watch`来观察一个字段，当这个字段的值发生变化的时候执行制定的观察者。如下：

```js
const ins = new Vue({
  data: {
    a: 1
  }
})

ins.$watch('a', () => {
  console.log('修改了 a')
})
```

如果我们修改了`a`的值，那么就会在控制台打印出`修改了a`这个字段。

我们用正常的原生js怎么实现读写事件监听呢？答案就是修改这个对象的`get`、`set`方法，这也就是`vue`的核心之一`数据劫持`，给出一个例子来说明吧。

```js
let a = {
  name: '123'
}
let value;

Object.defineProperty(a, 'name', {
  set(newValue) {
    console.log(newValue)
   	value = newValue
  },
  
  get() {
    return value;
  }
})
```

这样我们就实现了对属性 `a` 的设置和获取操作的拦截，有了它我们就可以大胆地思考一些事情，比如： **能不能在获取属性 a 的时候收集依赖，然后在设置属性 a 的时候触发之前收集的依赖呢？** 嗯，这是一个好思路，不过既然要收集依赖，我们起码需要一个”筐“，然后将所有收集到的依赖通通放到这个”筐”里，当属性被设置的时候将“筐”里所有的依赖都拿出来执行就可以了

```js
// dep 数组就是我们所谓的“筐”
const dep = []
Object.defineProperty(data, 'a', {
  set () {
    // 当属性被设置的时候，将“筐”里的依赖都执行一次
    dep.forEach(fn => fn())
  },
  get () {
    // 当属性被获取的时候，把依赖放到“筐”里
    dep.push(fn)
  }
})
```

