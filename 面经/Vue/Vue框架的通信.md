# Vue框架的通信方式

### Vuex通信

使用`Vuex`的一个标志量作为信号量，从而实现通信

### 父子组件的Props和Emit通信

父子组件传值使用Props和Emit

### EventBus

组件内部的是可以提交事件，也可以对本组件的事件提交进行监听，而EventBus就是通过这个特性，创建新的Vue对象，然后作为Vue的原型链上的一个数据，然后整个项目的组件都能够通过监听得知事件，所以它叫做事件总线，类似于一种发布订阅模式。

### 路由跳转带参数

单页面路由进行跳转的时候，可以携带params参数，也可以通过url进行传参。

### Provide/inject

provide函数提供一个数据，可供子组件获取，而inject则明确来自组件的数据

```js
// a组件
name: 'a'
provide() {
  return {
    msg: ''
  }
}

// b组件
name: 'b',
inject: {
  mes: {
    from: 'a',
    default: 'defaultValue'
  }
}
```

