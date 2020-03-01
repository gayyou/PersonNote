[TOC]

### 模块化

基本信息：

- 静态链接，与CommonJS相比，CommonJS是值引用，而模块化是动态引用，即修改目标值的话会目标修改。
- 支持动态加载：import('path')，返回的是一个Promise对象
- 由于是静态链接分析，所以export语句或者其import语句的时候不能够使用变量作为路径进行分析。

模块的引入：

- 对于ES6的模块化，使用type='module'能够在浏览器上面直接使用，但是目前是测试阶段，需要将后缀名改为.mjs,并且有如下特点：
  - 顶层this不是指向window，而是undefined
  - 变量只有本模块可用
  - 严格模式

循环加载的处理：

- CommonJS：同步处理，在进行加载模块的时候，会先判断是否加载过，如果加载过的话，返回module.export，如果没有加载过，会先去读本地文件，然后组织成一个function，然后执行完，把module.exports返回

- module的引用的话是一个动态引用，在引入的时候不会取值，相当于一个引用，在真正使用的时候才会去寻找，如果找不到则会报错。

  ```js
  // a.mjs
  import {bar} from './b';
  console.log('a.mjs');
  console.log(bar);
  export let foo = 'foo';
  
  // b.mjs
  import {foo} from './a';
  console.log('b.mjs');
  console.log(foo);
  export let bar = 'bar';
  
  // 结果
  $ node --experimental-modules a.mjs
  b.mjs
  ReferenceError: foo is not defined
  ```

  这是因为let声明的变量不会进行声明的提升，如果换成直接声明函数的话，是可以进行的，因为存在声明的提升，就可以初始化的时候，会进行函数声明的提升。

### 迭代器

- 迭代的特征有：返回对象，有value和done，value是迭代的值，done为true的时候表示迭代结束
- 数组、Map、Set、arguments、NodeList都原生具有迭代器
- 类数组不一定具有迭代器，只需要把[Symbol.iterator]属性改为数组的[Symbol.iterator]属性即可
- 可以使用数组的解构赋值，[...arr],和for (let item of tar)运算。
- 普通对象也可以定义其迭代器，迭代器是一个对象形式，具有next方法，这样就可以使用迭代语法
- generator流程函数返回一个迭代器

### Generator流程函数

Generator是协程在ES6上面的实现，每个Gen函数都有一个栈来记录当前函数上下文，这样就保证这个线程调用不在这个函数的时候，保存上下文以及变量。等再次执行到的时候还能读到当前栈帧。

- 执行generator函数会返回一个迭代器
- 懒求值，即在yield语句后面的运算会等到执行到的时候再求值
- 流程函数内部可以使用yield*对新的generator进行迭代
- 返回值可以使用return进行终止内部遍历、使用throw进行内部抛出内部异常

用处：

- 数组扁平化
- 异步函数自动执行