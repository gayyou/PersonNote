# JavaScript的Event loop

[TOC]

## 宏观任务和微观任务

JavaScript的任务分为宏观任务（macro tasks）和微观任务（micro tasks）。

- 宏观任务：script（全局任务），setTimeout、setInterval、setImmediate、I/O、UI rendering
- 微观任务：Process.nextTick、Promise、Object.observer、MutationObserver

事件循环的执行模式在`node`环境和浏览器环境下是不同的。先说说浏览器环境下的任务队列执行顺序是不同的。

这是因为浏览器的**Event Loop**遵循的是 **HTML 5**标准，而**node**环境下则遵循的是**libuv**。区别比较大。

### 浏览器环境

浏览器上面的执行环境如下：

- 从宏观队列中拉取一个任务，进行执行
- 从微观队列中一个一个拉取微观任务，进行执行
- 更新渲染UI

### Node环境

- 初始化Event Loop
- 执行主代码，如果碰到异步处理，就会分配给对应的队列（宏观、微观），直至主代码执行完毕
- 执行主代码中的所有微任务：先执行nextTick再执行其他微任务
- 开始Event Loop



```js
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

Event Loop分为六个阶段，为以下阶段

- timers: 这个阶段执行`setTimeout()`和`setInterval()`设定的回调。
- pending callbacks: 上一轮循环中有少数的 I/O callback 会被延迟到这一轮的这一阶段执行。
- idle, prepare: 仅内部使用。
- poll: 执行 I/O callback，在适当的条件下会阻塞在这个阶段
- check: 执行`setImmediate()`设定的回调。
- close callbacks: 执行比如`socket.on('close', ...)`的回调。

一旦初始化Event Loop后，就直接在Loop里面循环了，除非程序退出，否则一直在这个循环内执行。