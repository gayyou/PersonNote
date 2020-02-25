# Vue组件是如何进行处理v-on/@定义的事件的

我们在使用`Vue`框架的时候，最亲切的感觉是莫过于它将组件开发中的`HTML、CSS、JS`代码分割开来，保持着原生开发的习惯。并且`template`语法提供比原生更加强大的功能，对于事件监听来说，他提供`@click.left`、`@click.preventDefault`等等修饰方法，有没有想过框架的内部是如何实现的呢？下面就来讲解，尽量少讲代码，多讲流程和方法，因为这一部分代码就很多中情况考虑的多，多讲代码反而不好。

### 将template上面的事件绑定转为AST

`Vue`框架对`template`处理的流程是：

1. 词法解析：词法分析即对`template`语法进行判断是否使用不当，比如一些标签只能作为单标签，一些标签只能作为双标签，有些两者都能够使用。如果用户使用出错的话会在这一层提示。
2. 句法解析：基于语法分析进行的，对于键值对等信息进行分析，如一些动态的属性，就进行动态属性处理，一些静态属性交由静态属性处理器处理。
3. 生成抽象语法树：将上述处理的结果生成抽象语法树，抽象语法树的基本单位是`标签`、`表达式`、`普通文本`，生成树状结构，代表着代码的嵌套结构。
4. 由抽象语法树生成渲染函数，并且交由渲染函数观察者来使用。

### 将AST上面事件进行动态生成函数（重点）

在句法分析的时候，会对`@click.left="handler"`进行处理，会进行分类：

1. 浏览器内置事件，指的是我们原生使用到的那些事件，比如说`click`、`input`等等
2. `Vue`内部事件系统，即我们对组件自定义的事件。`$emit、$on`什么的。

| 内部处理后缀事件前缀 | 含义        |
| -------------------- | ----------- |
| !                    | 使用捕获    |
| ~                    | 渲染一次    |
| &                    | 开启passive |

接下来我们重点来讲解**普通的事件**：

事件分为`event`和`nativeEvent`，`event`针对于普通的标签，而`nativeEvent`针对于组件化的标签（对于组件的第一个元素进行事件监听）。不过两者的区别不是很大，我们拿`events`来进行讲解：

首先我们写一个例子：

![1582617155042](../../../../%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/PersonNote/%E9%9D%A2%E7%BB%8F/Vue/images/1582617155042.png)

对`span`标签进行添加事件，那么抽象语法树的节点的样子如下：

![1582617352554](../../../../%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/PersonNote/%E9%9D%A2%E7%BB%8F/Vue/images/1582617352554.png)

模板编译器会将我们写进去的修饰放在`modifiers`中，以便后面将抽象语法树转为代码的时候进行使用。然后我们将目光看到`compiler/codegen/events`中，如下图

![1582617571371](../../../../%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/PersonNote/%E9%9D%A2%E7%BB%8F/Vue/images/1582617571371.png)

看到这里，我们会知道里面的字符串其实是作为代码来使用的，所以我们会有预感：最后会使用`new Function`生成一个函数，然后这个函数使用了上面的代码。接下来看到本文件的`genHandler`函数，它是整合成代码的主方法。

```js
function genHandler (handler: ASTElementHandler | Array<ASTElementHandler>): string {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return `[${handler.map(handler => genHandler(handler)).join(',')}]`
  }

  const isMethodPath = simplePathRE.test(handler.value)
  const isFunctionExpression = fnExpRE.test(handler.value)
  const isFunctionInvocation = simplePathRE.test(handler.value.replace(fnInvokeRE, ''))

  if (!handler.modifiers) {
    // 没有修饰符的情况，直接返回调用的函数名
    // code...
  } else {
    // 有修饰符的情况下，先执行修饰符的代码，后再执行handler代码，所以封装成一个函数返回
    // code...
    return `function($event){${code}${handlerCode}}`
  }
}
```

如果没有修饰符的时候，是不会多一层函数来封装用户的回调方法的，而是直接调用用户的方法。这样就跟普通的时间绑定一致。但是有了修饰符，就会先执行修饰符产生的代码，还记得前面的图片展示了的判断代码吗？它就是来将修饰符转为代码的，接下来我们翻译翻译我们定义的事件处理后的代码吧！

![1582617352554](../../../../%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/PersonNote/%E9%9D%A2%E7%BB%8F/Vue/images/1582617352554.png)

```js
function($event) {
  $event.stopPropagation();
  $event.preventDefault();
  
  if (!$event,altKey) {
    return null;
  }
  
  sayName($event);
}
```

我们可以处理成上面的方法。所以如果有进行修饰的话，事件处理函数不是我们所看到的回调函数，而是封装了一层函数。在函数末尾才进行调用我们的回调函数。

### VNode进行事件监听的添加或者删除

对于普通的事件，最后是要添加到真实的dom节点上面的，所以在`VNode`进行渲染的时候，会进行节点的添加，在`src/platforms/web/runtime/modules/events.js`这里会有方法进行节点事件的添加。`updateListeners`采取的新旧事件监听更新的代码也很容易理解，这里就不进行讲解。不过要明白**对普通dom节点的事件监听是在VNode进行创建或者更新的时候**，而对于组件的事件监听的话，后续会补上。