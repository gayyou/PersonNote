# Vue+TypeScript一种良好的目录分配方式

### 引言

​	一个项目创建的初期，在设计项目的整体框架的时候，我们应当考虑到后期维护的方便最好选择一种分层或者模块化的思想的项目组织方式。这样有一定规矩的项目组织方式无论是后面进行维护，或者新人接手。会很容易上手来管理项目。

### 一、为什么选择TypeScript？

​	在编程的世界里，个人觉得无规矩就不成方圆。弱类型的语言提供的方便，并不代表着我们就可以滥用它。相反，我们要利用好弱类型的规则的同时，要遵循好编程的规范。如不随意将变量指向不同类型的数据等。这样的话会增加很多成本到注释和说明上面去。

​	**TypeScript**的出现无疑是为了解决以上的问题。但是它仅仅是提供一种编码时提示的功能（非常好用），实际上如果类型出错，不进行配置的话，还是可以转为**JavaScript**代码运行（它最终就是转为**js**代码）。无论是在接口方法的参数里面定义类型、**Vue**属性定义类型，它都是一种不错的选择。数据类型的定义为编译器提供自动补齐、类型错误时候提示等。有了类型的定义，我们可以减少甚至避免因为类型错误而出现的问题，并且**js**能做的，**ts**也能做，并且具有比**js**更多的功能。对**ES6**的写法具有很好的支持，这些都是我们所需要的。

### 二、目录简单介绍

先把整体的项目布目录放在这里，说明文件夹的目的。

```js
├─api									// 接口配置与实现文件夹
├─assets							// 静态资源存放
│  ├─fonts						
│  └─images
│      └─icons
├─components					// 公共组件
├─router							// vue-router
│  └─config						// 子路由配置
├─store								// vuex
│  └─modules					// 模块化
├─styles							// 公共样式
├─utils								// 工具
│  └─shared						// 基础工具类
└─views								// 视图，也就是比较完整的页面
   ├─layout						// 基础布局
   │  ├─leftSection
   │  │  └─item
   │  │      └─childrenItem
   │  └─rightSection
   └─login            // 登陆页面
```

我们可以看到，与传统的**vue**项目目录相比，仅仅多了**api**和**styles**这两个目录。但实际上改变的不仅仅只有这两个目录，我们以一个**后台管理系统**为例子来展示一下我的这个项目布局的思路吧。

#### 1.总体介绍

#### 2.数据交互

#### 3.页面布局组织

