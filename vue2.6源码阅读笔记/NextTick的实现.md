# Vue的NextTick的实现

### 1.微观任务和宏观任务

1. 什么是微观任务？什么是宏观任务？下面给一个比喻。

   在银行中，有一个队伍在一个业务窗口前面排队等待办理业务，那么在这个队伍中，进行办理的每个人的业务就是宏观任务，而办理的具体事项则是微观任务。其中宏观任务中可以开启微观任务，微观任务中也可以开启微观任务。

   从上面的例子里面可以看出来，微观任务其实是宏观任务的子集，也就是宏观任务的一小部分。

2. 宏观任务和微观任务的关系在代码中是怎么模拟表现的？

   按照我们上面的描述来看，微观任务可以叫做一个宏观任务的子任务，按照前面的理解的话，微观任务存放的数据结构是一个队列来着。执行一个宏观任务的时候，我们可以把这个宏观任务第一个执行的函数看做**第一个微观任务**，然后开始执行，会遇到以下的情况：

   - 普通代码：直接执行
   - 微观任务代码：放到本次宏观任务的微观任务队列中。
   - 宏观任务代码：放到宏观任务队列中

   - 等到本条微观任务执行结束后，从微观任务的队列中取出一条微观任务，继续执行以上步骤，直到微观任务队列中并不存在任何未执行的微观任务了，就继续下一个宏观任务。

3. 常见浏览器端的微观任务有哪些？

   - Promise的 then catch finally
   - MutationObserver

4. 常见的node端的微观任务有哪些？

   - Promise的 then catch finally
   - process.nextTick

5. 常见的宏观任务有哪些？

   - setTimeout
   - setInterval
   - setImmediate
   - i/o
   - requestAnimationFrame

6. 给出几道题加深印象

   1. ```js
      new Promise(resolve => {
          resolve(1);
          Promise.resolve().then(() => console.log(2));
          console.log(4);
      }).then(t => console.log(t));
      console.log(3);
      
      // 答案
      4
      3
      2
      1
      
      1. 外部代码new一个对象，并且执行传进来的函数
      2. 将本promise对象的状态改为resolve并传进去1
      3. 将Promise.resolve().then(() => console.log(2)); 添加进行微观任务
      4. 打印4  
      5. 返回promise对象
      6. 执行到.then(t => console.log(t))，将其放进去微观队列（第一段代码可以分成两句代码）
      7. 打印3
      8. 拿出微观队列队头，打印2
      9. 拿出微观队列对头，打印1（注意一下，本代码及之前全部都是同步任务）
      ```

   2. ```js
      async function async1() {
        console.log('async1 start');
        await async2();
        console.log('async1 end');
      }
      async function async2() {
        console.log('async2');
      }
      console.log('script start');
      setTimeout(function() {
        console.log('setTimeout');
      }, 0);
      async1();
      new Promise(function(resolve) {
        console.log('promise1');
        resolve();
      }).then(function() {
        console.log('promise2');
      });
      process.nextTick(() => {
        console.log('nextTick');
      })
      console.log('script end');
      
      1. 打印script start
      2. 执行async1函数，打印async1 start，并且将async2放进微观队列中，async接下来的代码是要等到微观任务async2执行完毕后执行
      3. 打印promise1，将打印promise2的代码放进微观队列中
      4. 将打印nextTick放到微观任务中
      5. 打印script end
      6. 取出微观任务中的async2，执行，打印async2
      7. 继续执行async1的内容，打印async1 end
      8. 取出围观任务队头，打印promise2
      9. 取出微观任务队头，打印nextTick
      10.打印setTimeout
      
      // 想问一下这样就是对的吗？
      不，它是错的，一定是错的，因为浏览器和node端的事件循环机制有点不同，微观任务的执行顺序也有不同。
      
      script start
      async1 start
      async2
      promise1
      script end
      nextTick
      promise2
      async1 end
      setTimeout
      ```

      具体原因在这里

      <https://juejin.im/post/5c337ae06fb9a049bc4cd218#heading-12>

### 2.Vue的nextTick实现详情

从上面我们知道一个事实：每一个宏观任务下进行定义的微观任务会比再这次宏观任务下定义的宏观任务更早实现，那么Vue提供的nextTick的api在一般情况下会比其他定时器更早执行。

由于代码很少，我们就直接来看代码分析吧！

```js
// 执行回调
function flushCallbacks () {
  pending = false
  // 这个操作复制了callbacks的副本
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
```

看到上面的代码，我们一定会问，为什么要复制了callbacks副本呢？那是因为微观任务可能会产生新的nextTick回调函数，如果不复制副本，然后把callbacks清空，那么可能会发生**死循环**！

接下来的话是一长串的if else

```js
if (typeof Promise !== 'undefined' && isNative(Promise)) {
	// 当可以使用Promise的时候，优先使用promise
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
	// 当可以使用MutationObserver的时候，优先使用MutationObserver
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
	// 使用setImmediate
} else {
  // Fallback to setTimeout.
  // 使用setTimeout
}
```

首先先看promise的处理方式

```js
const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    // 在有问题的UIWebViews中，Promise.then并不会完全中断，但是它可能会陷入一种怪异的状态，在这种状态中，回调被推送到微任务队
    // 列中，但是队列没有被刷新，直到浏览器需要执行其他一些工作，例如处理一个计时器。因此，我们可以通过添加空计时器来“强制”刷新微任务队列。
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    // 在IOS系统中出现bug，需要这么处理
    if (isIOS) setTimeout(noop)
  }
```

Promise.resolve()直接返回一个状态为resolved的promise实例，使用then的话直接推到微观任务队列中

再来看看MutationObsever

```js
// Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  // 当浏览器没有原生的Promise的时候，就采用MutationObserver
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)  // 这个MutationObserver的作用就是是设定某个dom发生改变的时候，这样就回调flushCallbacks
  const textNode = document.createTextNode(String(counter))
  // 将MutationObserver进行观察这个textNode对象，当这个textNode对象发生改变的时候，进行回调flushCallbacks函数
  observer.observe(textNode, {
    characterData: true
  })
  // 当执行timerFunc函数的时候，textNode会进行变化，就会触发observer的观察，从而触发flushCallbacks
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true  // 这个是一个微任务
```

很容易理解，用一个没有放到文档流上的文本节点，进行观察它，每次只要调用timerFunc就会触发flushCallbacks

剩下两个就不进行解释了。

我们可以发现这个东西在有条件的情况下使用的是微观任务，也就是在一般情况下它会比setTimeout更早实现，最差的情况下也是相当于setTimeout