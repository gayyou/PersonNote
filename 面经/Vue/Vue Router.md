# Vue Router

### 三种模式

##### abstract

在非浏览器情况下，都是使用abstract路由。

##### history

使用history需要后台进行访问**路径重定向**。history interface是浏览器历史记录栈 提供的接口，可以通过back()，forward()，go来进行访问浏览过的网页，h5提供了history.pushState，history.replaceState方法，作用分别是想历史记录栈压进浏览历史和修改历史记录。Vue router利用前两者进行修改历史栈和监听popState事件来进行调用相应的方法。

##### hash

利用页面的popState事件或者hashChange事件的产生来判断路由跳转相应的页面。优先使用popState，其次才是hashchange。它是利用浏览器的url上的hash进行修改的时候，不会跳转页面，所以不会去请求后台。然后通过监听浏览器的hashchange事件来进行路由匹配。所以总结下来，使用hashchange的支持原因：

1. 浏览器可以监听hashchange事件
2. 修改hash可以保存在浏览器的历史中，所以能够进行页面的回退
3. hash值修改不会去请求后台，所以无需后台进行重定向。

### History和Hash的区别

History和Hash的区别：

1. pushState设置新的url可以是与当前url同源的任意url，而hash只可以修改#后面的部分，故只可设置与当前同文档的url。
2. pushState设置的新url可以与前url一模一样，但是hash只能当hash产生改变的时候才进行回调。
3. history原生可以传递对象参数进历史栈中，等到popState的时候，可以根据拿到的参数进行操作（相当于保存某种状态的作用），而hashchange只能通过字符串传值。
4. pushState、replaceState和hashchange一样都不会向后台传输数据。