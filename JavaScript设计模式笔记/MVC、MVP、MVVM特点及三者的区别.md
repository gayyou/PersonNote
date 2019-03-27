# MVC、MVP、MVVM特点及三者的区别

### 简介MV*

标题中所介绍的三种模式都是隶属于MV*模式。后两者（MVP、MVVM）是MVC模式的衍生物。

M指的是Model，V指的是View，这两者在三个模式中的定义是一致的，所以我先介绍Model和View吧。

#### Model

Model的中文翻译是模型，那么，模型在模式中指的是什么？指的是一些数据的存储对象。比如一个人的信息就是一个模型，这个模型里面可以含有这个人的姓名、身高体重等等。存放数据的对象就是模型。在模型中，除了这些数据外，还必须有get、set等外界能够读写数据的方法。毕竟这个模型是要去使用的。可以设置的代码如下：

```JavaScript
var myapp = {}; // 创建这个应用对象

myapp.Model = function() {
    var val = 0; // 需要操作的数据

    /* 操作数据的方法 */
    this.add = function(v) {
        if (val < 100) val += v;
    };

    this.sub = function(v) {
        if (val > 0) val -= v;
    };

    this.getVal = function() {
        return val;
    };
};
```

#### View

View字如其意，即视图层，用户能够直接看到的就是view层，view层将数据展示给用户看。无需多讲。

传统的Model&View并不能满足现在的网页需求，毕竟用户和页面需要有一定的交互。所以产生了下面的三种模式

****

### MVC模式

```
那时计算机世界天地混沌，浑然一体，然后出现了一个创世者，将现实世界抽象出模型形成model，将人机交互从应用逻辑中分离形成view，然后就有了空气、水、鸡啊、蛋什么的。
——《前端MVC变形记》
```

MVC模式的由来

上个世纪70年代，[美国施乐帕克研究中心](https://link.juejin.im/?target=http%3A%2F%2Fbaike.baidu.com%2Flink%3Furl%3Dux_43rkE1Ythy0RI6WZIB6NZpSbJYxOSzVk1W7LItMteveUBPdAgoegLc2j8zA8XRqZPS0tTwMAKtAXhZ9jTClBFGzj4GV2zstDqWP7kFC3)，就是那个发明图形用户界面(GUI)的公司，开发了[Smalltalk](https://link.juejin.im/?target=http%3A%2F%2Fbaike.baidu.com%2Fitem%2FSmalltalk%2F1379989)编程语言，并开始用它编写图形界面的应用程序。

到了Smalltalk-80这个版本的时候，一位叫Trygve Reenskaug的工程师为Smalltalk设计了MVC（Model-View-Controller）这种架构模式，极大地降低了GUI应用程序的管理难度，而后被大量用于构建桌面和服务器端应用程序。



那么下面图解一下这个模式吧。

![](C:\Users\Administrator\Desktop\123.png)

[注释]用户输入是在view层进行输入的，但是处理的话是交给Controller进行处理的，所以上面的图的话，可以修改为输入再Controller进行输入，然后View层跟Controller层的双箭头编程C->V的箭头。这些都无关紧要。

上面虚线指的是观察者对象对Model进行监听，只要Model变化了View会进行变化，实际上Model没有直接对View层进行控制，所以永达搜了虚线。

那么MVC是怎么进行整个流程的数据传输呢？

用户在View层进行数据输入，View层并不会对其进行逻辑处理，直接交给Controller进行处理，Controller会对View层进行动画效果的操作，但是数据不会放到View层。而是通过对Model进行修改，从而触发对Model的观察者对象进行监听从而改变View层的值。

举个例子来模拟MVC模式吧：

```JavaScript
// model层
let myapp = {};

myapp.model = () => {
  let val = 0;
  
  this.add = (indence) => {
    val += indence;
  }
  
  this.sub = (indence) => {
    val -= indence;
  }
  
  this.getVal = () => val;
  
  // 观察者模式
  let views = [];
  
  this.register = view => {
    // 将想要观察的view层对象添加进来
  	views.push(view);
  }
  
  this.notify = () => {
    for(let i = 0; i < views.length; i++) {
      // 触发事件观察者对象回调函数
      views[i].render(this);
    }
  }
}

// view层
myapp.view = (controller) => {
  // 获取dom节点
  let document = document.getElement....;
	
  // 定义render方法，即当数据改变的时候进行相应的数据改变
  this.render = () => {
    // codes
  }
  
  // 添加Controller中的函数进行事件挂载
  document.['on' + EventType] = controller[EventFunc]；
}

myapp.controller = () => {
  let model = null,
      view = null;
  
  this.init = () => {
    model = new this.model();
    view = new this.view();
    
    // 进行观察者对象的注册，这样model层进行变化的时候就可以通知view层进行渲染
    this.register(view);
    this.notify();
  }
  
  // 下面的代码是执行model中的代码。即
  this.increase = function() {
        model.add(1);  // 操作
        model.notify(); // 通知观察者对象进行更新数据
  };
}
```

