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
  
  // model层的方法
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
  
  // 初始化创造相应的对象
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

很显然，MVC模式中，model层只是定义了对model中数据的操控方法和响应时候view层的并没有直接有业务逻辑处理。

1.而是有对应的观察者对象，这个观察者对象观察这个model是否发生了变化，再对view层进行更新。

2.用户对view层进行操控的时候，直接把这个行为传送给controller层进行处理，controller通过调用model层，对model进行更改，从而触发model层的观察者对象，通过观察者对象重新渲染view层的该对象。

总结为两点：

- model层负责存储数据，存储通过观察者对象观察变量改变后通知view层重新渲染的观察者对象（记住是**存储**观察者对象及其通知方法）！
- controller层对用户的输入进行处理后，通过调用model层的方法修改model属性，然后调用该model对象的观察者对象通知view层修改。
- view层对页面进行渲染，同时也通过获取节点，添加controller函数的事件。

****

### MVP模式

MVP模式是MVC模式的改良，由IBM的子公司Taligent提出。和MVC的相同之处在于：Controller/Presenter负责业务逻辑，Model管理数据，View负责显示。

![](C:\Users\Administrator\Desktop\321.png)

在MVC模式中，view层在进行渲染的时候是可以直接访问Model层的数据，但是在MVP中，View跟Model并不能直接互相访问，而是通过一个中介Presenter提供的接口进行互相访问更新。

与MVC相比，MVP模式通过解耦View和Model，完全分离视图和模型使职责划分更加清晰；由于View不依赖Model，可以将View抽离出来做成组件，它只需要提供一系列接口提供给上层操作。

其实这样讲也没有多大的效果，不如通过编写MVP模式的代码来了解这个MVP到底是什么东西吧

```JavaScript
myapp.model = () => {
  
  // 这个是model代码
  let val = 0;
  
  this.add = (indence) => {
    val += indence;
  }
  
  this.sub = (indence) => {
    val -= indence;
  }
  
  this.getVal = () => val;
} 

// 下面是View层代码
myapp.view = () => {
    let documentElement = document.getElementBy....

    this.render = (model) => {
        documentElement.operate...
    };

    this.init = () => {
        let presenter = new myapp.Presenter(this);
				// 添加事件监听
        documentElement.addListener....
    };
}
    
// 下面是Presenter层代码
myapp.presenter = (view) => {
	 	let _model = new myapp.Model();
    let _view = view;
		
  	// 添加model对象在render函数中
    _view.render(_model);

  	// 业务处理方法
    this.increase = function() {
        _model.add(1);
        _view.render(_model);
    };

    this.decrease = function() {
        _model.sub(1);
        _view.render(_model);
    };
}
```

由上面的代码可以看出：

- MVP模式中Model层只是存储数据和提供数据读写的接口。并没有其他东西。
- View层有对页面进行重新渲染的函数和新建一个Presenter对象的方法、添加事件监听，但并没有直接控制model的方法，即不会对model直接控制。
- Presenter层反而是通过业务逻辑代码，当页面点击view层触发事件函数，从而对model层进行修改的同时对修改的结果进行对view层的修改，从而比MVC减少了一个观察者对象的监听。但是多了一些业务逻辑处理代码。