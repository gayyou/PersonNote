# Vue源码之数据响应系统

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
- 需要有一个方法来进行注册依赖回调函数，所以用数据的`get`方法。

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
      
      return obj[key]		// 错误示范，这个会不断触发obj对象的key属性的getter方法，导致死循环
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

- 我们是如何去拿到数据的呢？

  我们是通过`obj[key]`这个代码去触发里面的`get`方法并且返回`val`，所以我们要有一个变量来缓存这个属性的值。

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

当然这些是比较严谨的vue的观察者对象的一些语法了，但是还有个很明显的缺点，如果想要观察的对象上有1000个属性，那么我们就必须对这1000个属性添加**getter**和**setter**方法，先不说占用的空间，在运行的时候，添加依赖的时候必定会造成卡顿，那么有没有更好的办法呢？

ES5是没有了，但是有个ES6的代理却能够做到，我就不在这里介绍了，如何使用的话，请见

[ES6代理模式实现Vue数据响应系统]: https://editor.csdn.net/md/?articleId=104033136

