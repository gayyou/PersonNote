## 同步与异步
一谈起Node，了解过的人会想起是利用异步IO实现高性能后台，那么什么是异步IO呢？
异步IO与同步IO的区别是什么呢？举个例子：在生活中，大家每天都会用到微信来进行聊天。那么某个时间有两个人来跟你聊天，同步与异步会有不同的表现（单线程的情况下）。

 - 同步：同步的做法是先选择一个比较先与你聊天的，把整个天都给聊完了，最后确定对方与你没有什么好聊的。ok接下去跟另外一个人进行聊天。
 - 异步：异步的做法是选择同时和这两个人进行聊天，每一次把信息发出去，等待对方回信息的时间内你都可以做其他事情，比如与编辑回复另外人信息。

这两个就是同步与异步的区别。只要不傻，肯定都是以第二种方式进行聊天。很多人会想，我为什么要在这里讲同步于异步的区别，既然异步这么好，开发的语言应该用到的是异步吧？
其实不然，很多开发的语言用到是同步。java处理并发是用到多线程（虽然java有一个nio处理异步，但是之前是很少人用到的，现在应该逐渐有人去重视这个），每个线程的执行是同步的。如果在这个线程中进行读取磁盘文件，在读取的过程中这个线程的资源是没有利用的。这个是同步的缺点。那为什么不使用异步呢？！异步的开发成本要高于同步，一般执行顺序不符合正常的逻辑思维（一般不是从上到下）。先说这么多，后面再讲明原因。

## 异步I/O
关于异步I/O，向前端开发工程师讲起来会比较简单一点，因为前端页面可以理解为是基于事件驱动的。用ajax发起请求对于前端工程师来说是更熟悉不过的

```
$.post('/url', {title: '深入浅出Node.js'}, function (data) {
  console.log('收到响应');
});
console.log('发送Ajax结束'); 
```
执行这一段代码的时候，假设后台是响应成功的，执行顺序是先打印“发起Ajax结束”然后再“收到响应”。这个很好理解，执行第二次打印的时候是当后台返回数据说响应成功后执行的。
我们只知道它将在这个异步请求结束后执行，但并不知道具体的时间点。异步调用中对于结果值的捕获是符合“Don’t call me, I will call you”的原则的，这也是注重结果，不关心过程的一种表现。
下面是ajax请求时候的图解。
![Ajax](https://img-blog.csdnimg.cn/20190330232409554.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FuY2VjaXM=,size_16,color_FFFFFF,t_70)
那么异步IO处理文件读取是怎么一回事呢？
Node调用文件读取需要导入fs模块，在浏览器中，js是无法直接访问主机上的文件的，是由于安全方面的考虑。但是node上是可以的。其代码如下：
```javascript
const fs = require('fs');
fs.readFile('文件路径', (err, file) => {
	console.log('文件读取完毕');
});
console.log('发起文件读取');
```
同样，这里发起文件读取是执行在文件读取完毕之前的。跟ajax类似，其图解也是类似的。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190330232900223.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FuY2VjaXM=,size_16,color_FFFFFF,t_70)
以上代码如果同时读取文件A和文件B，会几乎同时对A和B发起读取，然后线程可以执行其他代码，待到AB读取回调的时候，在执行相应的回调。这样就是异步IO的好处，可以原本读取一个文件的时间内读取更多的文件（假设文件同样大小）。
Node在这方面做得不错决定了Node比其他大多数后端语言的优势在于对IO密集型业务会有更好的表现。通常，说Node擅长I/O密集型的应用场景基本上是没人反对的。Node面向网络且擅长并行I/O，能够有效地组织起更多的硬件资源，从而提供更多好的服务。
I/O密集的优势主要在于Node利用事件循环的处理能力，而不是启动每一个线程为每一个请求服务，资源占用极少。
由于JavaScript是单线程语言，有人会问Node在cpu密集型业务逻辑中是不是表现不是很好。在JavaScript层面上讲，是对的。
换一个角度，在CPU密集的应用场景中，Node是否能胜任呢？实际上，V8的执行效率是十分高的。单以执行效率来做评判，V8的执行效率是毋庸置疑的。
这里引用《深入浅出nodejs》的一个小实验来进行。
那里用斐波那契数列用各种脚本语言进行试验，其中用java和go语言作为参考，得出结果如下图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190331000133987.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FuY2VjaXM=,size_16,color_FFFFFF,t_70)
可以看出Node中的C++模块表现还是挺不错的。
分析如下：
这样的测试结果尽管不能完全反映出各个语言的性能优劣，但已经可以表明Node在性能上不俗的表现。从另一个角度来说，这可以表明CPU密集型应用其实并不可怕。CPU密集型应用给Node带来的挑战主要是：由于JavaScript单线程的原因，如果有长时间运行的计算（比如大循环），将会导致CPU时间片不能释放，使得后续I/O无法发起。但是适当调整和分解大型运算任务为多个小任务，使得运算能够适时释放，不阻塞I/O调用的发起，这样既可同时享受到并行异步I/O的好处，又能充分利用CPU。
关于CPU密集型应用，Node的异步I/O已经解决了在单线程上CPU与I/O之间阻塞无法重叠利用的问题，I/O阻塞造成的性能浪费远比CPU的影响小。对于长时间运行的计算，如果它的耗时超过普通阻塞I/O的耗时，那么应用场景就需要重新评估，因为这类计算比阻塞I/O还影响效率，甚至说就是一个纯计算的场景，根本没有I/O。此类应用场景或许应当采用多线程的方式进行计算。Node虽然没有提供多线程用于计算支持，但是还是有以下两个方式来充分利 用CPU。
1. Node可以通过编写C/C++扩展的方式更高效地利用CPU，将一些V8不能做到性能极致的地方通过C/C++来实现。由上面的测试结果可以看到，通过C/C++扩展的方式实现斐波那契数列计算，速度比Java还快。
2. 如果单线程的Node不能满足需求，甚至用了C/C++扩展后还觉得不够，那么通过子进程的方式，将一部分Node进程当做常驻服务进程用于计算，然后利用进程间的消息来传递结果，将计算与I/O分离，这样还能充分利用多CPU。

## 异步操作实现
话题扯得有点远，今天的话题是Node的异步操作，那么接下来讲的是异步操作的实现。
传统中异步操作的实现有四种方式：

 - 函数回调
 - 事件监听
 - 订阅/发布模式
 - Promise模式

**函数回调**：先谈一下函数回调吧。这个是最基础的，在执行某个函数，达到某个逻辑条件时候调用某个函数传某个特定的参数，这样就是函数回调。其实这句话说了大家也看不懂，看个代码就可以理解了
```javascript
f1();
f2();
function f1(callback){
    setTimeout(function () {
        callback();
    }, 1000);
}
f1(f2);
```
这个例子中传入的参数是下一步要执行的函数。这样简单明了，在简单的业务逻辑下，看起来不错，但是一旦有复杂的逻辑，那么会有很多层的函数嵌套，这个可能开发到最后，如果修改一个小小的需求，可能没人能顶得住。所以函数回调的缺点是函数层层嵌套，很难看清楚整个流程。

**事件监听**：接下来是事件监听：前端对事件监听一定不会陌生，我对前端页面的理解，从某个方面上讲整个页面的逻辑调用都是基于事件监听的。很多函数的调用都是基于事件监听的。那么事件怎么实现呢？
````
// 当f1中监听到done事件后执行f2，这个在jq中能够实现的。用代码实现也不难
f1.on('done', f2);
function f1(){
    setTimeout(function () {
        // f1的任务代码
        f1.trigger('done');
    }, 1000);
}
f1();
````
这个逻辑，当一秒后f1发出信息说执行完毕了，就会执行f2函数。这种方法的优点是比较容易理解，可以绑定多个事件，每个事件可以指定多个回调函数，而且可以"去耦合"（Decoupling），有利于实现模块化。缺点是整个程序都要变成事件驱动型，运行流程会变得很不清晰。

**订阅/发布模式**：在这个模式中，订阅发布和前面的事件监听差不多，将那个事件改为信号，就是订阅/发布模式的了，这个在很多语言的设计模式是很常见的。
要得到信息，首先要进行事件订阅，然后等到某个特定的状态，再发布出去，所有订阅了这个事件的对象都会调用方法，我把整个代码都贴出来吧！
```javascript
let list: any = {};  // 存放订阅消息的列表
let num = 0;  // 当前订阅者的个数


export class PubAndSubImpl implements PubAndSub {
  publish(type: string, content: any): boolean {
    if (!list[type]) {
      // 当事件不存在的时候，抛出异常
      throw new class implements Error {
        message: string;
        name: string;
        stack: string;
      }
      return false;
    }

    setTimeout((): void => {
      // 一个一个发布出去，用settimeout是要在下个事件循环中进行调用所有的事件回调函数
      let subscribers = list[type],
          len = subscribers ? subscribers.length : 0;

      // 找到所有的订阅者并执行回调函数
      while(len--) {
        subscribers[len].func(type, content);
      }

    }, 0);

    return true;
  }

  subscribe(type: string, func: Function): string {
    // 当之前没有订阅过事件的时候
    if (!list[type]) {
      list[type] = [];
    }

    let token = (num++).toString();
    // 订阅事件
    list[type].push({
      func,
      token
    });

    return token;
  }

  unsubscribe(token: string): string {
    // 查询并取消事件订阅
    for (let m in list) {
      if (list[m]) {
        // 找到并取消事件订阅
        for (let i = 0, j = list[m].length; i < j; i++) {
          if (list[m][i].token === token) {
            list[m].splice(i, 1);
            return token;
          }
        }
      }
    }
    return "";
  }

}
```
以上就是实现的基本代码。可以去研究，但是最好去看一下JavaScript设计模式再说。
调用的方法如下：
```javascript
let pub: PubAndSub = new PubAndSubImpl();
pub.subscribe('a', callback);
settimeout(() => {
	pub.publish(this);
}, 1000);
```
这就是使用方法，其实跟事件监听很相似的。但是也有不同，所以在这里也区分开来。
这种方法的性质与"事件监听"类似，但是明显优于后者。因为我们可以通过查看"消息中心"，了解存在多少信号、每个信号有多少订阅者，从而监控程序的运行。

**Promise对象**：
Promise是一个容器，里面存放着未来可能发生的事情，通常这个发生的事情是一个异步操作。从语法上来看Promise是一个对象，通过构建一个实例来进行操作，这个实例有以下两个特点：

- 对象的状态不受外界影响，这个对象只有内部通过逻辑判断来进行对这个对象的状态进行更改，对象一共两种状态：正在进行（pending）和已经完成（resolved）。其中，pending可以转为成功（resolve）或者失败（reject）。注意：仅仅只有这个异步操作可以决定这两种状态，不能通过其他形式进行改变，这也就是这个对象名称的由来。Promise在英文中的意思就是承诺，表示其他手段无法改变。
- 对象的状态从pending转为resolved时候，这个对象的状态就凝固了，不能再进行改变了。所以这个对象一共就两个状态的转变：pending到resolve；pending到reject。
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
**then方法**

Promise对象实例构建完毕的时候，可以通过then方法对状态进行处理，这个then方法有两个参数（Function类型），分别是成功时候的回调和失败时候的回调函数。这两个函数的参数就是Promise函数内的状态转变时候的传的参数。实例代码如下：

```javascript
promise.then((value) => {
   	// success
}, (error) => {
    // error
});
```

then方法可以有两个参数，其中第二个参数可以不用加上去。

then方法支持链式调用，链式调用的前提是then方法返回的是Promise对象，而then方法在参数函数执行完毕得到返回值的时候，会进行判断，如果参数返回值是Promise实例的时候，就会使用这个实例；如果参数没有返回值或者返回值部位Promise的时候，会新建一个Promise对象，以便接下来的链式调用。
之前例子用Promise对象来执行的代码如下：
```javascript
function f2() {};
let promise = new Promise((res, rej) => {
	function f1() {
		settimeout(() => {
			res();
		}, 1000);
	}
	f1();
})
promise.then(() => {
	f2();
})
```

**async/await**
但是Promise对象的代码看起来也并不是很友好，还是需要进行对未来可能发生的事情进行预测后吧接下来的逻辑代码放到回调函数中（即作为某个方法的参数）。那么有没有一种方法能用同步代码风格实现异步操作呢？答案肯定是有的，而且出现在ES6中，即JavaScript的官方中，这就是async/await.
上面的代码用async和await来写要怎么写呢？
```javascript
function f2() {};
async f1() {
	await new Promise((res, rej) => {
		settimeout(() => {
			res();
		}, 1000)
	});
	f2();
}
```
这样的代码风格一看就是同步操作的代码。但是它在await后面没有执行完毕前，会卡住，不会执行f2函数，等到res函数调用后，才会执行。这样就以同步的代码实现异步。
NodeJS的异步就讲到这里啦。
