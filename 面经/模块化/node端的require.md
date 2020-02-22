# Node端的Require机制

Node端的每个模块是`Module`类的一个实例，利用了文件搜索算法以及**文件同步读取（决定了它是一个同步方式）**进行读取文件，然后通过转为闭包执行函数的方式来区分不同的模块。每个模块会导出一个module实例，其他模块可以通过这个实例来进行对模块的访问。

- 为什么可以直接使用`require`而不会报错，是在node中的全局对象增加的`require`吗？
- 答：并不是，是每个模块在打包的时候是一个匿名函数，这个函数在调用的时候，传进来的了`module`实例的方式，通过这样我们可以在模块中直接调用`exports, module, require, __dirname, __filename`这几个对象，而不需要通过其他方式进行创建。

### 1.用法

用户直接使用`require`直接导进模块，在`require`中传进一个字符串，它会通过规则去查询目标文件，具体的规则如下：

- 以一个例子来说明`require('a')`
- 查找内建模块a
- 查找本模块的`a.js、a.json、a.node`
- 找到上一级目录的`node_modules`文件夹中寻找`a`模块
- 循环上一个步骤，直至到根目录。

### 2.实现思路

主要步骤如下：

1. 查询缓存是否加载过该文件
2. 查询文件：这个查询的过程表现为它的规则
3. 创建`Module`实例，module实例表现为模块的父子关系
4. 读取文件，读取成一个字符串
5. 通过读取的文件创建函数
6. 执行函数，创建模块，并且进行缓存。
7. 导入模块实例的`exports`对象。

### 3.简化版代码

```js
const cacheMap = new Map();
const fs = require('fs');
const path = require('path');

let uid = 0;

class Module {
  constructor(path) {
    this.id = uid++;

    this.path = path;
    let code = this.readTargetFile(path);
    if (code) {
      this.compiler(code);
    }
  }

  readTargetFile(path) {
    let fileScript = null;
    try {
      fileScript = fs.readFileSync(path, 'utf-8');
      return fileScript;
    } catch (e) {
      console.log('文件读取失败')
    }

    return null;
  }

  compiler(code) {
    let func = new Function('module', 'require', '__dirname', code);

    func.call(this, this, require.bind(this), this.path);
  }
}

function myRequire(str) {
  let absolutePath = __dirname + '\\' + str;

  if (cacheMap.has(absolutePath)) {
    return cacheMap.get(absolutePath).exports;
  }

  let module = new Module(absolutePath);

  cacheMap.set(absolutePath, module);

  return module.exports;
}

console.log(myRequire('JSONP.js'));
```

