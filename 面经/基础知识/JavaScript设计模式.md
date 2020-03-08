[TOC]

### 设计模式原则

##### 单一职责原则

设计的每个模块，只需要完成一项功能即可，即降低设计的粒度

##### 开放-封闭原则

开放是指允许进行增加功能，封闭是指在增加功能的时候，选择增加代码而不是修改原有的代码。

##### 最少知识原则

一个实体尽可能少地跟其他实体直接发生相互作用。可以通过第三方来进行操作。比如访问一个变量，可以通过getter方法来封装。过多的联系可能会导致一个实体的变化影响多数实体。

- 减少对象之间的联系：在单一职责中鼓励降低设计的粒度，但是也不能够将粒度设计太小
- 尽量使用封装的方法。

### 设计模式

##### 1.单例模式

- 特点：全局使用到的只有一个对象

- 实现：使用闭包储存，然后通过工厂模式来进行获取对象

- 代码

  ```js
  function singleton(fn) {
    let instance = null;
    
    return (...args) => {
      if (!instance) {
        instance = new fn(...args);
      }
      
      return instance;
    }
  }
  ```

##### 2.策略模式

- 特点：定义一系列的算法，将他们封装起来，并且使他们可以互相替换。

- 核心：将算法的使用和算法的实现分离开来。

  策略类：封装了对于不同实体的具体实现算法

  环境类：对于可以随意更换策略类。

- 代码：

  ```js
  // 根据传进来的具体算法进行操作
  function computed(data, compare) {
    if (compare(data[0], data[1])) {
      // ...
    }
  }
  ```

- 优点：再增加比较类时候不需要对内部代码进行修改，只需要添加策略

- 缺点：策略集会比较多

##### 3.代理模式

- 特点：在访问真实数据之前，进行一些代理操作

- 核心：有一层代理层，进行统一处理。实现可以用Proxy进行代理实现，也可以使用其他方式

- 代码

  ```js
  function makeProxy(tar) {
    let proxy = new Proxy(tar, {
      get(tar, key, receiver) {
        // codes
        return Reflect.get(tar, key, receiver);
      }
    });  
    return proxy;
  }
  
  // 不使用代理的话，可以进行封装
  function makeProxy2(fn) {
    return function(...args) {
      // codes
      return fn.call(this, ...args);
    };
  }
  ```

##### 4.迭代模式

- 对于数组，对象的迭代是不同的，这个方法来定义对某种容器类型的迭代

##### 5.订阅-发布模式

- 特点：用户先去设定回调函数，还要主动去触发执行。

- 核心：有一个类进行管理事件

- 代码

  ```js
  class Publisher {
    eventsCbs;
    
    constructor() {
      this.eventsCbs = new Map();
    }
    
    subscribe(name, fn) {
  		let eventQueue = this.eventsCbs.get(name);
      if (eventQueue) {
        eventQueue.push(fn);
      } else {
        eventQueue = [fn];
        this.eventsCbs.set(name, eventQueue);
      }
    }
    
    publish(name, data) {
      let eventQueue = this.eventsCbs.get(name);
      if (eventQueue) {
        for (let i = 0; i < eventQueue.length; i++) {
          eventQueue[i](data);
        }
      }
    }
  }
  ```

##### 6.观察者模式

- 特点：设定回调函数绑定数据，不过与发布订阅不同，观察者是进行观察数据，数据发生变化的时候进行回调

- 核心：利用数据修改的方法进行更新，可以是使用代理来进行观察，或者使用defineProperty来进行观察

- 代码

  ```js
  let targetMap = new Map();
  let rawToReaMap = new Map();
  let reaToRawMap = new Map();
  
  let currentEffect = null;
  
  const isObj = tar => Object.prototype.toString.call(tar) === '[object Object]';
  
  function observe(target) {
    if (rawToReaMap.has(target)) {
      return rawToReaMap.get(target);
    }
    
    let proxy = new Proxy(target, handler);
    
    reaToRawMap.set(proxy, target);
    rawToReaMap.set(target, proxy);
    
    return proxy;
  }
  
  function effect(cb) {
    return {
      cb() {
        currentEffect = this;
        cb();
      }
    }
  }
  
  function track(tar, key) {
    let keyToDepMap = targetMap.get(tar);
    
    if (!keyToDepMap) {
      targetMap.set(tar, keyToDepMap = new Map())
    }
    
    let depSet = keyToDepMap.get(key);
    
    if (!depSet) {
      keyToDepMap.set(depSet = new Set());
    }
    
    if (currentEffect) {
      depSet.add(currentEffect);
    }
  }
  
  function trigger(tar, key) {
    let set = targetMap.get(tar).get(key);
    
    console.log(set)
    
    for (let item of set) {
      item.cb();
    }
  }
  
  let handler = {
    get(tar, key, receiver) {
      track(tar, key);
      let value = Reflect.get(tar, key, receiver);
      // 懒代理
      return isObj(value) ? observe(value) : value;
    },
    set(tar, key, value, receiver) {
      let result = Reflect.set(tar, key, value, receiver);
      trigger(tar, key);
      return result;
    }
  }
  
  let a = {
    name: 'weybn'
  }
  
  let proxy = observe(a);
  
  effect(() => {
    console.log(proxy.name);
  }).cb();
  
  proxy.name = '222';
  
  
  // 使用ES5进行观察
  let currentInstance = null;
  
  function observe(tar) {
    let keys = Object.keys(tar);
    let dep = new Set();
    
    for (let key of keys) {
      let val = tar[key];
      
      Object.defineProperty(
      	tar,
        key,
        {
          get() {
            // 进行依赖的添加
            track(dep);
            // 这里需要进行深度遍历观察
            return val;
          },
          set(value) {
            if (value === val) return ;
            val = value;
            trigger(dep);
          }
        }
      );
    }
  }
  
  function getWatcher(cb) {
    return {
      subs: [],
      cb() {
        currentInstance = this;
        cb();
      }
    }
  }
  
  function track(dep) {
    if (currentInstance) {
      currentInstance.subs.push(dep);
      dep.set(currentInstance);
    }
  }
  
  function trigger(dep) {
    for (let item of dep) {
      item.cb();
    }
  }
  
  let a = {
    name: 'weybn'
  }
  observe(a);
  
  getWatcher(() => {
    console.log(a.name);
  }).cb();
  
  a.name = '222';
  ```

##### 7.命令模式

- 特征：提前设定好命令，以及命令的执行函数，然后在调用的时候直接使用命令名来调用，这样将命令的设定和回调来进行解耦。
- 核心：类似于订阅发布模式
- 代码

##### 8.组合模式

- 特征：类树状结构，然后每个结点都具有相同的接口，如果你需要查找这棵树中的某个结点，只需要告诉根节点内容，然后根节点会把寻找的任务交接给子节点，这样就会找到最终结果。

- 核心：相同的接口，对外只开放一个对象。

- 代码：

  文件的遍历（即二叉树的遍历等等）\一个大的buffer由三个小的buffer来组合，然后访问数据

- 例子：操作树状DOM结点，要求把内部结点都添加上某种属性，如果用普通的方法的话，需要进行深度遍历，但是组合模式的话，留给用户只需要传进来操作的方法即可，内部会自动进行深度遍历，即外界**无感知**

##### 9.模板方法模式

- 特征：抽象父类，子类通过继承实现。
- 核心：继承
- 代码：。。。不举例

##### 10.亨元模式

- 特征：池化技术，对于一些可复用的对象，如果每次需要的时候去创建，那么内存开销会很大，而亨元模式则是去复用这些可复用的对象。并且这些对象有内部状态和外部状态之分：

  内部状态：不容易改变的。

  外部状态：容易进行改变。

- 核心：大部分状态可以转为外部状态的对象，而内部状态基本不变，那么可以使用亨元模式

##### 11.中介者模式

- 特征：各个对象都有关系，如果要把这些关系一一链接起来，那么会耗费很多时间，而中介者模式则是提供一个中介者来进行调度互相之间的关系。
- 核心：使用中间人进行控制

##### 12.装饰者模式

- 特征：给对象动态添加一些属性，不会影响到同类的其他实例的属性。
- 核心：在创建的时候进行动态添加，而不是在原型链进行添加。

##### 13.适配器模式

- 特征：对于一个接口，可能需要某种数据类型，用适配器将其他类型转为目标类型，然后加以调用。
- 核心：判断数据类型并且调用。

##### 14.外观模式

- 特征：对内部方法进行封装，使得用户更加容易使用，用户也可以直接访问内部方法。

##### 15.状态模式

