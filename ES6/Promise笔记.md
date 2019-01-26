# Promise笔记

### JS的异步编程方法：

目前掌握的JS的异步编程的方法有四种：

- 使用回调函数
- 使用事件监听
- 使用事件订阅、发布模式
- 使用Promise模式

### Promise简介

Promise是一个容器，里面存放着未来可能发生的事情，通常这个发生的事情是一个异步操作。从语法上来看Promise是一个对象，通过构建一个实例来进行操作，这个实例有以下两个特点：

- 对象的状态不受外界影响，这个对象只有内部通过逻辑判断来进行对这个对象的状态进行更改，对象一共两种状态：正在进行（pending）和已经完成（resolved）。其中，pending可以转为成功（resolve）或者失败（reject）。注意：仅仅只有这个异步操作可以决定这两种状态，不能通过其他形式进行改变，这也就是这个对象名称的由来。Promise在英文中的意思就是承诺，表示其他手段无法改变。
- 对象的状态从pending转为resolved时候，这个对象的状态就凝固了，不能再进行改变了。所以这个对象一共就两个状态的转变：pending到resolve；pending到reject。

****

### 基本用法

ES6已经在语法上对Promise对象进行部署了，所以直接调用Promise对象即可，对这个对象进行构造实例的时候，参数是一个函数，并且已经具有两个参数（resolve和reject）这两个参数分别是成功时候的回调函数和失败的时候的回调函数（失败情况一般是出错的时候，此时可以通过传参吧失败给后面的执行函数），以下是代码的实现:

```javascript
let promise = new Promise((resolve, reject) => {
    // code
    
    if (/* 异步操作成功的时候 */) {
    	resolve(value);   // 此时可以进行传参操作    
    } else {
    	reject(error);    // 进行传是失败的参数                      
    }
});
```

#### then方法

Promise对象实例构建完毕的时候，可以通过then方法对状态进行处理，这个then方法有两个参数（Function类型），分别是成功时候的回调和失败时候的回调函数。这两个函数的参数就是Promise函数内的状态转变时候的传的参数。实例代码如下：

```javascript
promise.then((value) => {
   	// success
}, (error) => {
    // error
});
```

then方法可以有两个参数，其中第二个参数可以不用加上去。

then方法支持链式调用，链式调用的前提是then方法返回的是Promise对象，而then方法在参数函数执行完毕得到返回值的时候，会进行判断，如果参数返回值是Promise实例的时候，就会使用这个实例；如果参数没有返回值或者返回值部位Promise的时候，会新建一个Promise对象，以便接下来的链式调用，模拟实现代码如下：

```javascript
/**
 * @author Weybn
 * @status 状态有 pending/fulfilled/rejected
 */
function Promise(fn) {
    let state = 'pending';
    let doneList = [];	// 执行成功时候函数列表
    let failList = [];	// 执行失败时候函数列表
    let doneValue, failValue;	// 保存转变状态后的回调的值
    let doneNext, failNext;		// then中参数函数的调用返回值，判断是否是Promise构建的对象，如果不是，则会赋值为新的Promise对象
    /* 部署then方法 */
    this.then = function(done ,fail){
        switch(state){
            case "pending": {
              // 正在进行中的时候，会将then的成功回调、失败回调放在一个队列中
              doneList.push(done);
              //每次如果没有推入fail方法，我也会推入一个null来占位，保持failList和doneList的数组长度同步，从而保证对应下标是同个then里面的参数。这里在resolve和reject的时候会用到
              failList.push(fail || null);
              return this;
            }
              
            case 'fulfilled': {
              // 当前的Promise对象状态变成fulfilled，即执行成功，将回调函数调用
              if (typeof done === 'function') {
                // doneValue是执行resolve时候的参数
                // doneNext返回值
                doneNext = done(doneValue);
              }
              // 判断doneNext是否是Promise对象，如果是的话，则返回这个值，如果不是的话，则新建一个Promise对象，方便链式调用
              return doneNext instanceof Promise ? doneNext : new Promise();
            }

            case 'rejected': {
              if (typeof fail === 'function') {
                failNext = fail(failValue);
              }
              return failNext instanceof Promise ? failNext : new Promise();
            }
        }
  	}
    
    function resolve(newValue) {
        state = 'fulfilled';
        doneValue = newValue;
        let value = newValue;
        for (let i = 0; i < doneList.length; i++) {
            // 解释一下下面代码的巧妙之处：
            // temp是执行doneList的返回值，有可能是Promise对象也有可能是其他的。
            let temp = doneList[i](value);
            if (temp instanceof Promise) {
                // 当返回值是Promise对象的时候，以temp为新的对象起点（赋值给newPromise)然后后面的都是以newPromise对象来进行，先将剩下的doneList和failList转移到新的newPromise，然后待newPromise内部的fn函数调用时候再进行调用
                let newPromise = temp;
                for (i++; i < doneList.length; i++) {
                    // 注意这里的for循环中第一个是i++，执行完毕后前面的循环也是执行完毕的。
                    newPromise.then(doneList[i], failList[i]);
                }
            } else {
                value = temp;
            }
        }
    }
    
    function reject(newValue) {
        state = 'rejected';
        failValue = newValue;
        let value = newValue;
        let tempRe = failList[0](value);
        if (tempRe instanceof Promise) {
            // 如果tempRe是Promise对象，则将剩下的reject放到下一个Promise对象中
            let newPromise = tempRe;
            for (i = 1; i < doneList.length; i++) {
                newPromise.then(doneList[i], failList[i]);
            }
        } else {
            // 如果tempRe不是Promise对象，则执行完当前的fail之后，继续执行下一个doneList
            value = tempRe;
            doneList.shift();
          	failList.shift();
            resolve(value);
        }
    }
    
    if (fn instanceof Promise) {
       setTimeout(() => {
    // 这里调用setTimeout看似0毫秒后执行没有什么区别，但是了解事件循环的同学就会知道，这个setTimeout是异步处理，会将里面的函数放到下一个事件循环的开始后执行。这样就保证了执行resolve的时候，doneList队列中是已经将所有的then方法加进去了。
        fn(resolve, reject)
    }, 0);
    }
}
```

#### catch方法

catch方法是then方法中第二个参数的简写，即catch(error) 和 then(null, error)是等价的。

Promise的链式调用具有冒泡性，即前面的错误会冒泡到后面，所以一般在调用then方法后可以在最后面调用一个catch方法进行捕获异常。Promise内部的异常并不会抛出到外面，所以一般是要有个catch来进行捕获异常。并且catch是有过滤性的，即如果链式调用上具有两个catch，则第一个catch会捕获前面的异常，此时后面就不会存在之前的异常。

catch是try/catch在Promise上的应用，以下代码进行说明

```JavaScript
let promise = new Promise((resolve, reject) => {
    throw new Error('test');
});
promise.catch((error) => {
    console.log(error);
})
// Error: test
// 这个写法和下面的一致
let promise = new Promise((resolve, reject) => {
   reject(new Error('test')); 
});
```

但是，一旦Promise的状态转变成为fulfilled的时候，就不能进行抛出异常了。

一般情况下，不要在then方法中加入捕获异常，而是多用catch方法进行捕获异常。

如果前面没有抛出异常的话，会跳过catch这个调用方法。

#### done方法（这个方法不是API里面的，但是可以自己部署）

这个方法可以将Promise的异常抛出到外面，而且代码很简单，也很容易理解，是利用到事件循环和作用域对象的转变。代码如下：

```javascript
Promise.prototype.done = (onFulfilled, onRejected) => {
    this.then(onFulfilled, onRejected)
    	.catch((reason) => {
            setTimeout(() => {
               	throw new Error(reason); 
            });
    	});
}
```

这个方法也可以不需要参数，直接将产生的异常抛出到外面。

#### finally方法（这个方法也不是API里面的，可以自己部署）

这个方法是接受一个回调函数，无论如何这个回调函数都会执行的，实现的代码如下：

```JavaScript
Promise.prototype.finally = (callback) => {
    let promise = this.constructor;
    return this.then(
    	value => promise.resolve(callback()).then(() => value);
        error => promise.reject(callback()).then(() => throw error);
    );
}
```

