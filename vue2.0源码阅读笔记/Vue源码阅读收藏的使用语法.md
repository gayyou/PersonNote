# Vue源码阅读收藏的使用语法

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
- 