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

![img](http://47.102.136.151:4000/personNote/MVC.png)

[注释]用户输入是在view层进行输入的，但是处理的话是交给ontroller进行处理的，所以上面的图的话，可以修改为输入再Controller进行输入，然后View层跟Controller层的双箭头编程C->V的箭头。这些都无关紧要。

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

![img](http://47.102.136.151:4000/personNote/MVP.png)

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
- Presenter层反而是通过业务逻辑代码，当页面点击view层触发事件函数，从而对model层进行修改的同时对修改的结果进行对view层的修改，从而比MVC减少了一个观察者对象的监听。但是多了一些业务逻辑处理代码。可以理解为presenter是进行对双方进行调和操作。

****

### MVVM模式

MVVM（Model-View-ViewModel）最早由微软提出。ViewModel指 "Model of View"——视图的模型。

![img](http://47.102.136.151:4000/personNote/MVVM.png)

MVVM把View和Model的同步逻辑自动化了。以前Presenter负责的View和Model同步不再手动地进行操作，而是交给框架所提供的数据绑定功能进行负责，只需要告诉它View显示的数据对应的是Model哪一部分即可。

以Vue框架为例：

Model：在MVVM中，Model层仅仅是存储数据就足够了，对于数据进行处理并不在model层中，仅仅存放数据，所以在Vue中只是一个类似于json对象的东西：

```javascript
let data = {
  val: 0
}
```

View：在View层中，只是负责对数据进行格式化展示，在vue中有模板语法。用两个大括号来显示data中的值：

```vue
<div id="myapp">
    <div>
        <span>{{ val }}rmb</span>
    </div>
    <div>
        <button v-on:click="sub(1)">-</button>
        <button v-on:click="add(1)">+</button>
    </div>
</div>
```

ViewModel：这个是MVC中的Controller或MVP中的Presenter，也是整个模式的重点，业务逻辑也是集中在这里。其中的核心是数据绑定。与MVP不同的是，View层中并没有提供接口给VM层进行调用，因为View层用的是模板语法直接穿插在html中，所以VM的逻辑开发并没有接口可调。所以VM需要处理View和Model之间的数据同步。当Model变化的时候View会自动更新，当View中变化的时候，Model也会随着变化。

```vue
new Vue({
    el: '#myapp',
    data: data,
    methods: {
        add(v) {
            if(this.val < 100) {
                this.val += v;
            }
        },
        sub(v) {
            if(this.val > 0) {
                this.val -= v;
            }
        }
    }
});
```

整体来看，比MVC/MVP精简了很多，不仅仅简化了业务与界面的依赖，还解决了数据频繁更新（以前用jQuery操作DOM很繁琐）的问题。因为在MVVM中，View不知道Model的存在，ViewModel和Model也察觉不到View，这种低耦合模式可以使开发过程更加容易，提高应用的可重用性。

![img](https://images2015.cnblogs.com/blog/934644/201706/934644-20170605065014715-756941854.png)

在Vue中，使用了双向绑定技术（Two-Way-Data-Binding），就是View的变化能实时让Model发生变化，而Model的变化也能实时更新到View。

不同的MVVM框架中，实现双向数据绑定的技术有所不同。目前一些主流的前端框架实现数据绑定的方式大致有以下几种：

- 数据劫持 (Vue)
- 发布-订阅模式 (Knockout、Backbone)
- 脏值检查 (Angular)

我们这里主要讲讲Vue。

Vue采用数据劫持&发布-订阅模式的方式，通过ES5提供的 `Object.defineProperty()` 方法来劫持（监控）各属性的 `getter` 、`setter` ，并在数据（对象）发生变动时通知订阅者，触发相应的监听回调。并且，由于是在不同的数据上触发同步，可以精确的将变更发送给绑定的视图，而不是对所有的数据都执行一次检测。要实现Vue中的双向数据绑定，大致可以划分三个模块：Observer、Compile、Watcher，如图：

 

![img](https://images2015.cnblogs.com/blog/934644/201706/934644-20170605065056184-307547986.png)

 

- Observer 数据监听器
  负责对数据对象的所有属性进行监听（数据劫持），监听到数据发生变化后通知订阅者。
- Compiler 指令解析器
  扫描模板，并对指令进行解析，然后绑定指定事件。
- Watcher 订阅者
  关联Observer和Compile，能够订阅并收到属性变动的通知，执行指令绑定的相应操作，更新视图。Update()是它自身的一个方法，用于执行Compile中绑定的回调，更新视图。

#### 数据劫持

一般对数据的劫持都是通过Object.defineProperty方法进行的，Vue中对应的函数为 `defineReactive` ，其普通对象的劫持的精简版代码如下：

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
var foo = {
  name: 'vue',
  version: '2.0'
}

function observe(data) {
    if (!data || typeof data !== 'object') {
        return
    }
    // 使用递归劫持对象属性
    Object.keys(data).forEach(function(key) {
        defineReactive(data, key, data[key]);
    })
}

function defineReactive(obj, key, value) {
     // 监听子属性 比如这里data对象里的 'name' 或者 'version'
     observe(value)

    Object.defineProperty(obj, key, {
        get: function reactiveGetter() {
            return value
        },
        set: function reactiveSetter(newVal) {
            if (value === newVal) {
                return
            } else {
                value = newVal
                console.log(`监听成功：${value} --> ${newVal}`)
            }
        }
    })
}

observe(foo)
foo.name = 'angular' // “监听成功：vue --> angular”
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

 

上面完成了对数据对象的监听，接下来还需要在监听到变化后去通知订阅者，这需要实现一个消息订阅器 `Dep` ，Watcher通过 `Dep` 添加订阅者，当数据改变便触发 `Dep.notify()` ，Watcher调用自己的 `update()` 方法完成视图更新。



## 总结

MV*的目的是把应用程序的数据、业务逻辑和界面这三块解耦，分离关注点，不仅利于团队协作和测试，更有利于甩锅维护和管理。业务逻辑不再关心底层数据的读写，而这些数据又以对象的形式呈现给业务逻辑层。从 MVC --> MVP --> MVVM，就像一个打怪升级的过程，它们都是在MVC的基础上随着时代和应用环境的发展衍变而来的。

在我们纠结于使用什么架构模式或框架的时候，不如先了解它们。静下来思考业务场景和开发需求，不同需求下会有最适合的解决方案。我们使用这个框架就代表认同它的思想，相信它能够提升开发效率解决当前的问题，而不仅仅是因为大家都在学。