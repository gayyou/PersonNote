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

- 首先获取`data`，`data`是在选项合并的时候合成的一个函数，现在要执行这个函数来获取数据，但是我们要先对`data`的类型进行检查，因为在进行`data`的初始化之前我们会回调一次`vue`的生命周期，这也是`vue`的生命周期中`beforeCreate`，开发者有可能对这个`$data`对象进行修改，修改成其他类型。
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
// 进行简单模拟Vue的数据响应系统
let dep = [];

let obj = {
  name: ''
}

Object.defineProperty(obj, 'name', {
  get() {
    dep.push(Target)
  },

  set() {
    dep.forEach(fn => fn());
  }
})

// 全局的Target
let Target = null

function $watch(pro, fn) {
  // 将传进来的回调函数传给Target
  Target = fn;

  // 调用obj的写入方法，进行添加依赖
  obj[pro]
}
```

很多人可能会有一些疑惑，为什么是在`get`的时候进行添加依赖而不是在`set`的时候添加依赖呢？

- 数据响应系统的目的是数据的属性一旦发生改变，就通知`$watch`方法进行执行函数更新数据，所以要对`get`方法进行响应
-  需要有一个方法来进行注册依赖回调函数，所以用数据的`get`方法。

我们可以通过以下的代码来进行测试。

```js
$watch('name', () => {
  console.log('我是第一个依赖回调函数')
})

$watch('name', () => {
  console.log('我是第二个依赖回调函数')
})

obj.name = '123';
// 我是第一个依赖回调函数
// 我是第二个依赖回调函数
```

上面就是最简单的数据响应的一个小的demo。但是我们想，一个对象不可能只有一个属性吧，那么如果改为多属性呢？答案就是加个迭代循环就行了。

```js
// 进行简单模拟Vue的数据响应系统
let obj = {
  name: '',
  value: 1
}

for (let key in obj) {
  let dep = [];
  
  Object.defineProperty(obj, key, {
    get() {
      dep.push(Target)
      
      return 
    },

    set() {
      dep.forEach(fn => fn());
    }
  })
}

// 全局的Target
let Target = null

function $watch(pro, fn) {
  // 将传进来的回调函数传给Target
  Target = fn;

  // 调用obj的写入方法，进行添加依赖
  obj[pro]
}

$watch('name', () => {
  console.log('name')
})
$watch('value', () => {
  console.log('value')
})

obj.name = '1';
obj.value = '1'

// name
//value
```

到此时的话，有一些细心的人可能会有一些疑惑了，比如下面这串代码：

```js
obj.name;   // undefined
```

这样的处理会导致obj的属性没有返回任何的值，那么就要进行以下的处理

```js
for (let key in obj) {
  let dep = [],
      val = obj[key];
  
  Object.defineProperty(obj, key, {
    get() {
      dep.push(Target)
      
      return obj[key]		// 错误示范
      return val  // 正确的做法
    },

    set(newVal) {
      // 如果新的值跟原来的值一样的话，那么说明这个新的值
      if (newVal === val) {
        return ;
      }
      
      // 更新值
      val = newVal;
      dep.forEach(fn => fn());
    }
  })
}
```

很多人一定会这么想，就是直接调用上面的代码就好了，但是要想一下：

- 我们是如何去触发这个`get`函数的？

  我们是通过`obj[key]`这个代码去触发里面的`get`方法并且执行这串代码的，如果你返回还是用这个代码的话，那么就会造成死循环。

我们这样的话是做了一个数据响应观察的一个小小的demo，但是还有许多问题没有解决，比如如何去观察嵌套的属性呢？

```js
function detail(obj, key) {
	const dep = [];
	let val = obj[key];
  Object.defineProperty(obj, key, {
    get() {
      if (Target) {
        dep.push(Target)
      }

      Target = null
      
      return val  // 正确的做法
    },

    set(newVal) {
      // 如果新的值跟原来的值一样的话，那么说明这个新的值
      if (newVal === val) {
        return ;
      }
      
      // 更新值
      val = newVal;
      dep.forEach(fn => fn());
    }
  })
}

// 进行遍历属性
function iterateObj(obj) {
  for (let key in obj) {
    if (isPlainObject(obj[key])) {
      iterateObj(obj[key])
    } else {
      detail(obj, key);
    }
  }
}

function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

iterateObj(obj)
```

上面就是最简单的数据观察响应的系统，但是还是跟我们的`Vue`里面的watch差别还是比较大的，最大的明显是人家可以用字符串来代替对象的路径。

```js
$watch(obj, 'b.name', () => {
  console.log('b.name')
})
```

解决办法要根据js的一个特性来：对象的属性或者方法可以用[key]来进行访问，并且支持变量字符串进行访问，那么我们的思路就是将这些路径推进一个数组中，然后按顺序进行查找，所以我们要对`$watch`进行改进。

```js
/**
 * obj {Object}
 * pro {String}
 * fn {Function}
 */
function $watch(obj, pro, fn) {
  // 将传进来的回调函数传给Target
  Target = fn;
  
  let pathArr = pro.split('.'),
      baseObj = obj;
 	
  for (let i = 0; i < pathArr.length; i++) {
    if (!baseObj) {
     	// 说明填写的路径错误
      throw new Error('路径出错')
    }
    // 在最后一个下标的时候就会进行访问到obj.b.name
    baseObj = baseObj[pathArr[i]];
  }
}
```

我们举个例子进行测试吧。

```js
$watch(obj, 'b.name', () => {
  console.log('newName');
})
obj.b.name = '123'

// newName
```

这样我们就完成了对字符串路径进行解析并且访问了。

我们再想想，这个`$watch`方法的思路是什么？这个方法就是要尽可能能够触发对象方法的拦截器`get`从而添加一下依赖。那么`$watch`的第二个函数可以是一个函数（只需要这个函数能够触发这个被监听的对象的属性就行了）

那么我们就需要对`$watch`方法进行修改。

```js
function $watch(obj, pro, fn) {
  // 将传进来的回调函数传给Target
  Target = fn;
  
  if (typeof pro === 'Function') {
    pro();
    return ;
  }
  
  let pathArr = pro.split('.'),
      baseObj = obj;
 	
  for (let i = 0; i < pathArr.length; i++) {
    if (!baseObj) {
     	// 说明填写的路径错误
      throw new Error('路径出错')
    }
    // 在最后一个下标的时候就会进行访问到obj.b.name
    baseObj = baseObj[pathArr[i]];
  }
}
```

这样子就是实现了我们的需求。

当然这些是必答严谨的vue的观察者对象的一些语法了。

## Observe工厂函数

接下来我们看到vue源码中的observe函数吧

```js
observe(data, true /* asRootData */)  // 这个是进行调用
```

下面是这个方法的源码。

```js
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
  	// 如果是一个对象或者这个值是Vnode的实例，那么不执行
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    // 如果value有这么一个 __ob__ 属性并且这个value.__ob__是Observer的实例的话，那么将ob 赋值为value的ob属性
    ob = value.__ob__
  } else if (
    shouldObserve &&		// shouldObseve 是一个boolean
    !isServerRendering() &&		// 并不是正在服务器渲染中
    (Array.isArray(value) || isPlainObject(value)) &&		// 是一个数组或者是一个纯对象
    Object.isExtensible(value) &&		// value对象那个是能够进行动态添加属性的
    !value._isVue   // 这个对象并不是vue对象
  ) {
    ob = new Observer(value)		// 创建一个新的观察者并赋给这个观察者
  }
  if (asRootData && ob) {
    ob.vmCount++		// 如果是一个rootdata，那么就将vmCount进行添加
  }
  return ob
}
```

我们逐行对这个函数进行分析吧。

````js
if (!isObject(value) || value instanceof VNode) {
  // 如果是一个对象或者这个值是Vnode的实例，那么不执行
  return
}
````

这个要变成观察者一定要是个对象并且不能是一个`VNode`的实例，如果不满足的话，就会放回`undefined`，如果不是对象就没有一个监听的意义了。

接下俩的话是这么一串代码。

```js
let ob: Observer | void
if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    // 如果value有这么一个 __ob__ 属性并且这个value.__ob__是Observer的实例的话，那么将ob 赋值为value的ob属性
    ob = value.__ob__
} else if (
    shouldObserve &&		// shouldObseve 是一个boolean
    !isServerRendering() &&		// 不是服务器渲染中
    (Array.isArray(value) || isPlainObject(value)) &&		// 是一个数组或者是一个纯对象
    Object.isExtensible(value) &&		// value对象那个是能够进行动态添加属性的
    !value._isVue   // 这个对象并不是vue对象
) {
    ob = new Observer(value)		// 创建一个新的观察者并赋给这个观察者
}
```

我们现在看`if`里面的代码是觉得有点蒙蔽，为什么具有这个属性的就可以不用创建对象实例呢？我们可以大胆去猜想这个`value`对象很可能就是已经被观察的数据了。那我们先不去看这串代码，我们先去看一下这个实例化`Observer`的对象会有什么东西吧。

我们可以从`core/observer/index.js`中进行查询到这个`Observer`类函数，代码如下：

```js
/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value  	// 传进来数据，必定是一个Object类型
    this.dep = new Dep()	
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

/**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```

首先我们先看到了这个类的构造器吧，这个类的构造其中，首先看到这个Dep

```js
this.dep = new Dep();
```

这个dep是什么呢？这个dep就是我们在`响应系统的基本思路`中的存放一类的筐的定义，存放着数据监听的依赖并且对数据的`getter`和`setter`方法进行修改。里面的内容当然要比我们之前的简单例子还要复杂。

```js
def(value, '__ob__', this)
```

接下来用到了`def`这个方法，这个对定义了不可以枚举的对象，也就是这个`__ob__`是一个不可枚举的属性，在`for...in`中是不会被发现的。

接下来是这样的代码：

```js
if (Array.isArray(value)) {
  if (hasProto) {
    protoAugment(value, arrayMethods)
  } else {
    copyAugment(value, arrayMethods, arrayKeys)
  }
  this.observeArray(value)
} else {
  this.walk(value)
}
```

判断这个传入来的`value`值是否是个数组，如果是数组的话就会进行相应的操作。如果是对象的话，就会调用`walk`方法。我们先来看一下`walk`

```JS
/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
walk (obj: Object) {
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i])
  }
}
```

获取每个可枚举的属性并且对这些属性进行添加观察。我们看一下`defineReactive`这个方法吧。

```js
/**
 * Define a reactive property on an Object.
 */
export function defineReactive (
  obj: Object,	// 对象
  key: string,	// 键值
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()  // 创建一个筐

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}
```

