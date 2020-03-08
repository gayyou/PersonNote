# Vue特殊的全局组件

[TOC]

### Keep-Alive

- 重写Render函数，使用对象作为Map，使用keys数组来作为过期队列，这样就是一个很简单的LRU算法
- 在触发渲染的时候，会进行判断新的组件是否是已缓存的，从而进行维护cache和keys
  - 如果是已经缓存的，那么从把VNode从缓存中拿出来，然后在render中返回
  - 如果没有缓存的话，那么就会放进来缓存中，并且根据max来执行lru算法
- 判断是否缓存的key值
  - 如果传进来key，那么就是用当前key
  - 如果没有key，则用组件的`component.cid`+`::${tag}`