# Generator函数的异步应用

### 传统的异步编程方法：

- 回调
- 事件监听
- 事件订阅/发布
- Promise对象

****

### Generator异步编程

编程有异步和同步之分，同步编程是一个线程在执行一个语句的时候，无论这个语句需要多长时间，都需要等待执行完毕，在这段时间中这个线程不能去干别的事情，如果遇上大文件读取，则会卡住比较长时间。而异步编程则是在进行一些异步操作的时候（比如IO读取等），线程能够去执行别的代码块，等到这个IO读取完毕时候再来调用回调函数，从而最大限度地利用线程的资源。打个比方吧：在生活中，我们在同一个时间内，可能会与很多人聊天，那么，同步编程就是一个人聊天聊完了，然后再跟接下来的人进行聊天。异步编程则是发送一条信息给一个人，再等待这个人回复的时间内我们可以和其他人进行聊天，从而达到时间的最大利用。

#### 协程

传统的编程语言中早有异步编程的解决方案（其实是多任务的解决方案），其中有一个叫做协程，意思是多线程合作，具体步骤如下：

- 第一步，协程A开始执行
- 第二步，协程A执行一半，进入暂停状态，将执行权转移到协程B中
- 第三步，协程B交还执行权
- 第四步，协程A恢复执行

#### 协程的Generator实现

Generator是协程在ES6上的实现，最大特点就是可以交出执行权（即暂停执行）。

整个Generator函数就是一个封装的异步任务，任务需要停止的地方都是yield语句。这个可以根据Generator的代码可以看出。

#### Generator函数的错误处理和数据交换

Generator执行后返回的遍历器对象的next方法的参数和返回值的value属性分别是向协程传入数据和得到协程状态的数据。

根据Generator的语法，Generator可以得到函数外面遍历器对象抛出的异常，这就实现了跨空间和跨时间解决抛出异常，这对异步编程无疑很重要。

#### 异步任务的封装

最简单的利用Generator函数进行异步操作的封装的代码如下：

```javascript
const fetch = require('node-fetch');

function* gen() {
  let url = 'http:xxxxx';
  let result = yield fetch(url);
  console.log(result.bio);
}

let g = gen();
let result = g.next();
result.value.then((data) => {
  return data.json();
}).then((data) => {
  g.next(data);
})
```

上面的代码中，Generator函数分装了请求的异步操作函数，其中调用fetch进行发送数据，并且等待返回数据后，即fetch函数调用完毕后，在进行下一步操作。

但是上面的代码存在一些问题，就是不知道何时能够进行下一步的next，即回调并没有控制下一次调用next的标志，即存在线程空闲时间。

****

### Thunk函数

#### 参数求值策略

在Thunk在上个世纪60年代的时候已经被提出来了，在那个时候，计算机科学家在讨论研究如何编写编译器比较好，一个争论的焦点就是参数在调用的时候的求值策略，在调用函数的时候，如果参数是个表达式，是要先进行计算还是在要用到这个参数的时候进行计算的争论。分为两个策略：

举个例子进行解释：

```JavaScript
let x = 1;

function f(m) {
  return m * 2;
}

f(x + 5)
```

- 传值调用：调用的时候，在进入f函数体前将x + 5计算出结果后再进入函数体。
- 传名调用：直接将表达式放进函数体，在需要m的时候再进行计算。

答案各有利弊：传值调用比较简单，但是如果一个函数没有用到参数的时候，传值调用会损失一定的性能。

#### Thunk函数的含义

Thunk函数的实质是将一个多个参数的函数进行一步一步添加参数，每次添加参数的时候回返回一个新的函数，将这个参数添加到函数的步骤中。在Thunk函数的所有函数的参数必定是函数，将多个参数的函数替换成一个只接受一个函数作为参数的单参数函数。示例代码如下：

```JavaScript
let Thunk = function(fileName) {
  return (callback) => {
    return fs.readFile(fileName, callback);
  }
}

let readFile = Thunk('txt');
readFile(() => {});
```

大家可能会问这个Thunk有什么用？以前是没有什么用，但是ES6出来后，Thunk函数可以作为Generator函数的自动流程管理。

先举一个例子自动实现函数的所有流程的简单demo

```JavaScript
function* gen() {
  // code
}

let iter = gen();
let res = g.next();

while(!res.done) {
  console.log(res.value);
  res = g.next();
}
```

这样while循环会自动执行所有的yield后面的表达式，能够实现按顺序执行的前提是这个表达式必须是同步。而Thunk可以实现异步操作。那么，Thunk可以实现异步操作自动控制Generator的流程，如何实现的呢？！

举一个读取本地文本文件的例子：

```JavaScript
const fs = require('fs');
const thunkify = require('thunkify');
const readLineThunk = thunkify(fs.readFile);

let gen = function* () {
  let r1 = yield readLineThunk('1');
  console.log(r1.toString());
  let r2 = yield readLineThunk('2');
  console.log(r2.toString());
}

let g = gen();
let r1 = g.next();
r1.value((error, data) => {
  if (error) {
    throw error;
  }
  let r2 = g.next(data);
  r2.value((error, data) => {
    if (error) {
      throw error;
    }
    g.next(data);
  })
})
```

上面是手动设置实现流程，可以实现异步操作时候按顺序执行，但是缺点很明显，如果存在一个需要多步操作的异步操作，那么需要嵌套很多层，这样并不能够实现解耦，那么有没有一个方法能够自动按顺序执行异步操作呢？！

下面介绍一个自动流程管理：

对上面的方法进行自动化处理：

```JavaScript
const fs = require('fs');
const thunkify = require('thunkify');
const readLineThunk = thunkify(fs.readFile);

let gen = function* () {
  let r1 = yield readLineThunk('1');
  console.log(r1.toString());
  let r2 = yield readLineThunk('2');
  console.log(r2.toString());
}

function run(fn) {
  let gen = fn();

  function next(error, data) {
    let result = gen.next(data);		// 将所得的数据作为next的参数进行传入，并在函数体内打印出来
    if (result.done) {				// 结束的标志
      return;
    }
    result.value(next);		// 由于是Thunk函数，next是这个readFile的回调函数
  }
  
  next();
}

// 下面是Promise自动流程控制版本
function run(fn) {
  let gen = fn();

  function next(data) {
    let result = gen.next(data);
    if (result.done) {				// 结束的标志
      return result.value;
    }
    result.value。then((data) => {
      next(data)
    });		
  }
  
  next();
}


run(gen);	
```

上面的gen函数的readLineThunk是一个Thunk函数，执行完毕会返回一个参数是回调函数的函数，然后next的方法是作为这个返回函数的参数，自动流程控制的程序run步骤如下：

- gen得到Generator的遍历器指针
- 第一次调用next函数，得到一个result，是一个对象，value是函数来着（第一次调用next会忽略data参数）。
- 判断是否结束
- 对result的value属性添加回调函数，一旦读取文件完毕后，会执行这个回调函数，即next函数，实现了一步一步来的程序效果。

****

### co模块

这是一个小模块来着，是一个程序员TJ Holowaychuk发布的，可以实现自动流程控制管理的。返回的是一个Promise对象，因此可以用then方法来执行下一步操作。我们需要了解其内部实现思路。

#### co模块的原理

前面说过，Generator就是一个异步操作的容器，它的自动流程控制是需要一个机制的，这个机制就是要交回程序控制权。有两种方法可以做到：

- 回调函数，将异步操作封装成为Thunk函数，在回调函数里面交回执行权
- Promise对象：在then方法中交回执行权

co模块其实就是两种执行器（Thunk和Promise对象）包装成一个模块，使用co的前提是Generator函数的yield语句后面只能是Thunk函数或者Promise对象。如果一个数组或者对象的里面全是Promise对象，也是可以使用的。（co4.0以后，yield后面只能是Promise对象）。

#### co模块的源码

```JavaScript
function co(gen) {
  var ctx = this;

  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.call(ctx);		// 当gen是个Generator函数的时候，会先将作用域在这个函数中执行
    if (!gen || typeof gen.next !== 'function') return resolve(gen);	// gen为空或者并不是个Generator遍历器对象的时候，返回执行成功

    onFulfilled();	// 调用执行成功函数
    function onFulfilled(res) {	
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }    
  });
}

function next(ret) {
  if (ret.done) return resolve(ret.value);	// 异步操作成功的时候，结束调用循环
  var value = toPromise.call(ctx, ret.value);	// 将ret的value属性封装成Promise对象
  if (value && isPromise(value)) return value.then(onFulfilled, onRejected);  // 如果是Promise对象的时候，会调用上面的onFulfilled函数，从而实现循环，循环结束的标志是ret.done为true，即这个函数的第一句。这样实现了自动控制流程
  return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following object was passed: "' + String(ret.value) + '"'));
    }	// 调用失败的时候
});
```

上述代码的next方法一共有这样4行命令

- 检查是否是Generator最后一次运行，标志是检查ret.done是否存在
- 确保每一次返回值是Promise对象。用到toPromise将返回值的value属性封装成Promise对象
- 使用then方法为返回值加上回调函数，然后通过onfulfilled函数再次调用next函数进行下一步操作，从而实现自动控制的异步操作
- 不符合要求的时候抛出异常，然后onfulfilled函数捕获

