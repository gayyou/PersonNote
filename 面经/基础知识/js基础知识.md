# JS的基础知识

### 1.对象篇

##### new操作符中构造函数中执行了什么？

1. 创建一个新的Object
2. 将新的Object的原型设为构造函数的原型，新的Object的constructor设为构造函数
3. 将构造函数当做普通函数，然后把执行上下文对象设为新创建出来的对象
4. 如果构造函数返回的是基本数据类型，那么返回this，如果是引用数据类型的话，则返回引用的数据类型。

##### ES6的类和ES5构造函数的区别

1. ES6的类只能被new字符来进行，不能当做普通函数执行；但是ES5则可以
2. ES6类的原型上的属性不可被枚举，但是ES5构造函数的原型属性上能够被枚举
3. ES6函数不存在声明的提升，；但是ES5存在声明的提升，也就是可以先使用后声明
4. ES6可以在类中定义类的静态属性；ES5只能对构造函数增加属性，定义静态属性和方法。
5. ES6可以通过new.target来判断执行的构造函数，可以使某些父类不能被实例化；而ES5只能通过其他方式来进行判断。可以通过this.constructor来进行判断。
6. ES6的继承是先在constructor调用super来执行父类的构造器来，然后返回新创建的实例（这个实例是子类的），然后再进行执行子类构造器来修改this（最后是子类），并且如果不调用super的话是不能使用this的。ES5则是先创建子类this，然后再通过执行父类构造器对this进行修改。

### 函数式编程篇

##### 什么是闭包？闭包的作用是什么？

闭包：有权访问其他局部作用域（函数）一次执行结果内部的自由变量就叫做闭包（即执行函数的时候引用了不是自己作用域链内的数据就是闭包）

闭包三要素：函数、自由变量、执行环境（也就是上下文）

闭包的作用：

- 设置保护性缓存，也就是设置一个缓存只能通过某种函数去访问

  ```js
  function cache(fn) {
    let cache = {};
    return (...key) => {
      let result = null;
      
      if (cache[key]) {
        result = cache[key];
      } else {
        cache[key] = (result = fn(...key));
      }
      
      return result;
    };
  }
  ```

- 设置私有变量

  ```js
  let _privateVar = Symbol();
  class A {
    getName() {
      return this[_privateVar];
    }
    setName(value) {
      this[_privateVar] = value;
    }
  }
  ```

- 函数防抖

  ```js
  function debounce(fn, time) {
    let timer = null;
    
    return (...args) => {
      if (timer) {
       	clearTimeout(timer);
        timer = null;
      }
      setTimeout(fn, timer, ...args);
    };
  }
  ```

- 单例模式的函数式构造方法

  ```js
  function singleFactory(constructor) {
    let obj = null;
    
    return function(...args) {
      return obj ? obj : obj = new constructor(...args);
    }
  }
  ```