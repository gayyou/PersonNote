# Vue源码阅读收藏

## 一、性能类型语法

### 1.缓存：

```ts
function creatCache(fn) {
  const cache = Object.create(null)
  return (function cachedFn (str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  })
}
```

## 二、功能类型的语法

### 1.vue里面观察者的模型

```js
// 进行简单模拟Vue的数据响应系统
let obj = {
  name: 'name',
  value: 1,
  b: {
    name: 'val'
  }
}

// 对细节进行处理
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

// 对obj添加依赖
iterateObj(obj)

// 全局的Target
let Target = null

/**
 * obj {Object}
 * pro {String | Function }
 * fn {Function}
 */
function $watch(obj, pro, fn) {
  // 将传进来的回调函数传给Target
  Target = fn;
  
  if (typeof pro === 'Function') {
    // 当第二个参数的是函数的时候，可能会访问到这个对象的某个属性，只要是get方法就能够触发拦截
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
  
  Target = null;
}

用例1:
$watch(obj, 'b.name', () => {
  console.log('newName');
})
obj.b.name = '123'

用例2: 
function render () {
  return document.write(`姓名：${obj.name}; 年龄：${obj.value}`)
}
$watch(obj, render, render);
```

上面大概就是vue里面观察者对象的基本原理，但是还是存着着一些问题：

- 如果是第二个函数是一个渲染函数，比如说是上面的`render`那么在进行渲染的时候，会访问到obj的属性的get方法，会触发拦截器，那么这样就会重新触发添加依赖，这是必然的，因为访问到了数据（我上面的代码通过判断Target是否是空的进而防止依赖的添加）

### 2.以数组的变异方法为例，说说vue对js原生的对象进行“改写”

​	这里的改写并非直接对原生对象进行改动，而是通过某个方式让开发者使用的方法发生改变。

​	vue中观察者观察的对象一般是在vue选项中的`data`选项已经定义好的方法，如果需要将添加进来的数据进行观察的话，那么就要用到`vue.$set`这个方法进行添加。除了以上两种方法进行监听，vue还有一种专门针对于数组的变异方法进行触发vue观察者的监听以及更新。熟悉`Vue`的人一定会知道有数组的所有操作都会进行数据与视图层的同步。首先看一下`Array`对象有哪几个原生的方法。

```js
ArrayMethods = [
	'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
```

以上就是原生的`Array`的所有属性，那么我们是如何对这些方法进行“改写”的呢？思路很简单：

1. 创建一个原生数组对象原型的一个子类实例。
2. 将上述的子类实例作为vue中的数据属性（`Array`类型）的原型，这样就可以实现对原生对象方法的改写。

首先我们要创建一个`Array`的实例。

```js
let proto = Array.prototype;
let subArray = Object.create(proto);
```

接下来对数组的所有方法进行遍历，然后通过重新给subArray的方法进行定义，这样我们就完成了对原生js的改写

```js
let def = (obj, key, enumerable, fn) => {
  Object.defineProperty(obj, key, {
    value: fn,			// 回调函数
    enumerable: !!enumerable,  // 如果是undefined的话，那么就直接为false，而并非undefined
    writable: true,			// 可写
    configurable: true	// 可重新配置
  })
}

ArrayMethods.forEach(val => {
  const original = arrayProto[method]     // 获取数组的方法名
  def(arrayMethods, method, function mutator (...args) {  // 运用es的内容，将参数全部放在一个数组里面
    // 首先得到原生的方法的一个执行，并作为一个缓存。
    const result = original.apply(this, args)
    const ob = this.__ob__    // 获得对象的观察者属性
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        // push或者unshift的情况下，拿出所有的参数
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2) // 如果是splice的话，就么去除前两个参数，在前面执行原生的去除第一第二个参数的内容。
        break
    }

    if (inserted) ob.observeArray(inserted)   // 对inserted这个数组进来的内容进行添加观察者
    // notify change
    ob.dep.notify()     // 触发对象的依赖
    return result       // 返回执行的内容，我们这个函数只是对添加的内容进行添加观察，而不会对原本的数组的该方法产生任何影响
})
```

这就是`vue`中数组的方法也能触发更新数据对象的依赖的原因。

### 3.返回元素序列化后的结果

vue中在没有渲染模板字符串的时候，会将父容器作为模板，但是父容器是一个`dom`节点，那么怎么将这个`dom`节点转化为字符串呢？这就需要使用到`dom`节点的`outerHTML`属性。

```js
/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 * 返回整个元素的序列化结果
 */
function getOuterHTML (el: Element): string {
  // 内容包含描述元素及其后代的序列化HTML片段
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    // 如果没有序列化的方法的话，那么会在外面创建div包容这个标签并且返回容器的innerHTML
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}
```

## 三、实用和比较偏的语法

### 1.实用的语法

- 如何去掉字符串的首尾各一个字符？

  ```js
  let str = str.slice(1, -1);
  ```

  

### 2.比较偏的知识点

- `JSON.stringify`和`toString`的区别是什么？

  1. 字符串，数字，布尔值的`JSON.stringify()`规则和`toString`基本相同。

  2. 对于对象而言，除非是修改过，否则`toString()`方法返回的是内部属性，如`[object Object]`,`'[object Array]`。对于`JSON.stringify`则是返回字符串序列化的结果。

  3. 对于一些不安全的`JSON`值，比如`null`、`undefined`。`toString`会报错，`JSON.stringify`并不会。

  4. 有一个特别偏的点，在`Vue`源码中使用到`v-pre`属性的时候发现的：

     ```js
     const a = new Function('console.log()');
     const b = new Function(JSON.stringify('console.log()'));
     
     // a
     function() {
       console.log()
     }
     // b
     function() {
       "console.log()"
     }
     ```

     可以看出来用`JSON.stringify`返回的虽然也是字符串，但是还是会区别于普通的字符串。

- p标签的几种使用：
  - `<p>肥琛`：解析成为`<p>肥琛</p>`
  - `<p>肥琛</p>`：解析成为`<p>肥琛</p>`
  - `肥琛</p>`：解析成为`肥琛<p></p>`