##### 1.什么是serverLess？

serverLess也叫Fass，即Function as a service，即通过函数式编程来进行完成后端服务。

通常是具有云端服务器来提供计算，用户将自己的服务存放在云上，调用到服务的时候，就会去请求某个接口，由第三方提供算力来执行函数，执行完函数不会保存任何信息，所以是无状态的。

这样用户可以不用自己搭建服务器，只需要编写函数存放到第三方的服务器上即可。第三方通过流量来计费。

对于前端，nodejs非常适合进行编写程序执行这样的代码。

