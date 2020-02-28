# Web Worker和Service Worker

### 什么是Web Worker？

Web Worker是浏览器解决多线程的思路，js可以通过引用同源下的js文件作为新创建的js线程，不用耗主js线程来进行一些需要占用cpu的计算。是一种解决单线程执行cpu密集型的方法。不过虽然是一个js进程，但是它不具备访问window对象和document对象的权限。与主进程的是通过postMessage和message事件来通信。

### 如何创建Web Worker？

1. 通过创建一个js文件，然后进行动态调用，即new Worker(url).
2. 在工程化中，则是采用worker-loader来进行代码分割，从而才能独立成文件。
3. 也可以不使用js文件来进行处理，思路是
   - 先定义一个函数，函数体内根据来进行填写worker内部的代码
   - 使用Function.toLocalString，然后根据正则表达式去除头部的`function xxx() {}`这个壳
   - 使用Blob对象，创建成js文件，即new Blob([String], 'text/javascript')，返回一个Blob
   - 使用URL.createObjectUrl(blob)。然后通过new worker进行引用即可

### Web Worker通信

##### 1.postMessage

父进程直接使用worker.postMessage向子进程进行传输数据，而子进程使用postMessage来向父进程进行传输数据。其中分为两种形式传递信息，一种是直接拷贝使用，另外一种是使用ArrayBuffer来传递地址使用。前者直接将数据放在第一个参数即可，后者则需要转为ArrayBuffer类型的数值，从而来进行传递值。着重讲一下后者的实现：

```js
let bufferArray = new ArrayBuffer(1024 * 1024);  // 是一种二进制传值
worker.postMessage(bufferArray, [bufferArray]);  // 这样子进程拿到的时候，也是二进制流，不过这样实现了0拷贝
```

ArrayBuffer是一个比较底层的数据结构，存放着二进制数据，如果要获得它的数据，则要使用UnIntArray等进行获取数据，UnIntArray相当于一个视图，因为ArrayBuffer是一个一连串的二进制数据，以不同的宽度来查看的话，能够得到不同的数据，视图就是这么来的。

##### 2.message事件

父进程使用worker.onMessage来进行监听事件，而子进程直接使用onMessage来进行监听事件

##### 3.error事件

父进程使用worker.onerror来进行监听事件，而子进程直接使用onerror来进行监听事件

##### 4.关闭进程

使用termate()来进行关闭进程。

### 什么是Web Service？

