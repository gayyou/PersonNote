## 学习Vue的关键知识点

#### 1.数据响应系统

- 在defineReactive
  - Dep
  - Watcher
    - 渲染函数
    - 非渲染函数

defineReactive是一个关键点，学习完后要回答

- Dep是什么东西？
- Watcher又是什么东西？
- Dep和Watcher有什么关系？
- 数据响应的流程
- 为什么要在getter里面添加依赖，在setter里面响应
- Wather执行的时候，渲染函数里面的依赖和非渲染函数里面的依赖的执行顺序是什么？区别是什么？为什么要这么来做