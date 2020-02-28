# Vuex

### Vuex的本质

Vuex的本质是一个共享对象，共享内存的作用，绑定在Vue对象的原型上，所以每个组件可以通过this来进行访问。

### Vuex创建时间

`Vuex`在使用new新建实例的时候，在这个实例的`beforeCreate`生命周期钩子函数中被创建

### Vuex规范

Vuex中的使用了规范大于规定的思想，读取数据的时候，通过访问`$store`对象的属性去访问，而修改数据的时候，vuex的建议是通过mutation或者action来进行修改数据，其中mutations是同步函数，并且直接操纵数据，而action则是支持异步函数，是通过执行mutaions来进行修改数据。

### Vue如何实现响应式

Vuex利用了Vue的数据响应系统，在Vuex中创建了一个Vue实例，通过这个Vue实例来将Vuex的数据绑定到Vue数据响应系统中。

### Dispatch和Commit

Dispatch进行提交Action类型的任何，而Commit进行提交Mutation任务，第一个参数是任务名称，第二个参数是传值。

其中任务名称可以通过`/`来访问子module中的函数。