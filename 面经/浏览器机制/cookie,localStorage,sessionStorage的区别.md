# Cookie，LocalStorage，SessionStorage的区别

**三者都具有同源策略**

### 存储空间

同样具有本地存储，不过`Cookie`存储的容量只有5KB，而`LocalStorage`和`SessionStorage`存储的容量是5MB

### 生命周期

- Cookie如果没有设定时间，默认关闭浏览器就消失了
- LocalStorage如果不清除，会永久存在
- SessionStorage只存在于一个会话中（指的是浏览器会话，即由一个网页弹出跳到另外一个同源网页中）

### 特点

- Cookie在发送请求的时候，会携带上去
- LocalStorage和SessionStorage不是自动和后台交互