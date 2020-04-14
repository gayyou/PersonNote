[TOC]

# React

### 高阶组件HOCs

#### 1.什么是高阶组件

​	高阶组件是React高级编程的一种体现，它并不是普通组件那样提供视图渲染，而是对一类普通组件进行抽象的功能，实现逻辑复用。

​	比如现在有A组件和B组件，两者渲染功能相似，都是进行获取数据后进行渲染。那么如果是普通组件的形式，就要使用到以下代码：

```jsx
import React from "react";

class GraphList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: getGraphList()
    }
  }
  
  componentDidMount(): void {
    // do somethings
  }
  
  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void {
    // get data
  }

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <div>
        我是GraphList组件
      </div>
    );
  }
}
```

上面是组件A，下面是组件B

```jsx
import React from "react";

class CommentsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: getCommentsList()
    }
  }
  
  componentDidMount(): void {
    // do somethings
  }
  
  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void {
    // get data
  }

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <div>
        我是CommentsList组件
      </div>
    );
  }
}
```

可以看到两者具有很大的相似度，如果有N个相同需求的组件，那么就要开发N个组件代码，这样不利于代码的复用。这时候就可以使用到高阶组件。

```jsx
function getDisplayDataComponent(component, getDataFn) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: getDataFn()
      }
    }

    componentDidMount(): void {
      // do somethings
    }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void {
    // get data
  }

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <Component {...props}></Component>
    );
  }
}
}
```

这样A组件和B组件只需要由高阶组件函数来创建组件执行即可，这样可以实现代码的复用。

#### 2.高阶组件的特征

1. 是一个自定义的函数
2. 返回一个内部匿名组件，以传进来的组件为渲染内容

#### 3.高阶组件的作用

1. 使用组合的思想而不是继承的思想来实现
2. 实现抽象解决业务

#### 4.使用高阶组件的注意点

1. 内部返回一个新的包装组件
2. 不可修改原始组件

###  Diffing  algorithm

#### 1.为什么要使用diffing算法

react在更新渲染的视图的时候，在DOM和react之间有一层Virtual DOM，有两个目的：

- 抽象（用来跨平台等等）
- 实现DOM或者组件的复用

在实现DOM或者组件的复用的时候，如果每次更新的时候都重新创建并渲染所有的dom或者组件的话，那么会比较慢。这时就需要使用到diffing算法，找到相同的组件，进行复用，不同的组件进行删除和创建。

#### 2.diffing算法的要求是什么

1. 对于不同类型的标签，那么不进行diff算法
2. 对于相同类型的标签，先对本身的属性进行更新，可以更新修改过的属性，并且如果有子树，那么会对子树进行更新。

#### 3.index作为diffing算法的好处和坏处在哪

1. 针对于受控组件，也就是状态全由父容器进行控制的时候，那么每次渲染的时候，直接进行复用组件，只是更改状态，这样效率更高
2. 但是针对于内部存在状态的组件，那么就会有问题，index相同并且标签相同，那么会认为是相同的组件，从而会造成一些预料之外的错误。

#### 4.使用key和不使用key的时间复杂度的区别

1. 使用key，那么会用到map，map的时间复杂度是O(1)
2. 不使用key，那么会遍历整个子树数组，那么时间复杂度是O(n)。

### render prop

#### 1.存在的意义

如果有一个组件是比较通用的，但是内部的组件并不是唯一的，而是比较多种情况，那么如果按照普通的组件的业务逻辑的话，需要写不同的组件。下面举个mouse的例子

Mouse类

```tsx
class Mouse extends React.Component {
  render() {
    return (
      <div></div>
    );
  }
}
```

下面是第一个组件

```tsx
class RenderProps1 extends React.Component {
  render() {
    return (
      <>
        <A/>
        <Mouse/>
      </>
    );
  }
}
```

下面是第二个组件

```tsx
class RenderProps2 extends React.Component {
  render() {
    return (
      <>
        <B/>
        <Mouse/>
      </>
    );
  }
}
```

在两个组件中，其实很多东西是相同的，但是就是在渲染的时候是不同的，此时如果分成两个组件的话，那么会产生很多不必要的硬编码问题。而Render Prop则是一种解决上述问题的思路

所以说Render Props其实是提供一种思路去解决一类问题，它的实质其实就是组件之间传参，你可以使用其他参数名，都可以，同样也可以使用插槽来解决。所以也是一种IOC的思想。

### 生命周期

#### 1.旧的生命周期

旧的生命周期和Vue的生命周期很相似，以render为中心，有两个情况下会围绕render。

1. 第一次渲染，即挂载，那么它的执行顺序是
   - 初始化props、state
   - componentWillMount
   - render
   - componentMouted
2. 接下来是循环，即触发重新渲染
   - props changed 或者 states changed（后者的话是componentWillReceiveProps）
   - shouldComponentUpdate   （需返回true）
   - componentWillUpdate
   - render
   - componentDidUpdate
3. 最后是销毁
   - componentWillUnmount

#### 2.新的生命周期

新的生命周期也是围绕render来进行的，不过去除了componentWillMount和componentWillUpdate，改为加前缀的。增加了合并props和state的生命周期钩子函数，它的作用是合并在更新前对state进行处理。

1. 第一次渲染：

   - constructor

   - 合并props和state
   - render
   - componentDidMount

2. 更新数据时候

   - 起点：props changed、state changed、forceUpdate（不会触发shouldComponentUpdate）
   - 合并props和state
   - 判断是否需要更新（props和states才需要）

React不推荐使用componentWillMount和componentWillUpdate这两个钩子函数，并且在之后的话，会用UNSAFE_前缀来作为向下兼容使用。

#### 3.Render应当是Pure函数

在React中，与Vue不同的是，Vue更新渲染层的时候，起点是修改了**渲染函数所绑定的数据**，从而引发观察者的执行。而React只要在组件中调用了setState函数，那么就会重新执行render，将返回值进行更新至视图层中。所以在render中不建议对state进行修改数据。

#### 4.getDerivedStateFromError和componentDidCatch

前者比后者先拿到error，前者存在就不会执行后者。都是ErrorBoundary来进行捕获异常使用的。建议使用前者来进行捕获异常，以后只保留前者。

#### 5.getSnapshotBeforeUpdate

拿到Update前的快照，钩子函数具有两个参数，分别是preProps，preState，是更新前的参数，然后有一个返回值，配合componentDidUpdate来使用。作为componentDidUpdate的第三个参数。用来比较更新前后。

#### 6.shouldComponentUpdate

有三个参数，代表着新的props、state、context。返回boolean，用来决定当前组件是否有必要进行执行render来更新。

### 受控组件和非受控组件

狭义来看，**非受控组件**主要应用于有自己状态的input标签组件中。react app不使用绑定的单向数据流来进行控制组件，而是使用dom操作来对组件的状态进行控制，这样的话，**用户需要使用代码去控制组件，而不是通过React框架来对组件的状态进行控制。**

但是从广义上来看，非受控组件既包括具有自己状态的DOM标签，也可以包含自己内部状态可以更改的组件，即内部会根据用户的操作而改变数据，而不受调用者控制。

### React API

#### 1.React.Component和React.PureComponent的区别

Component在Props或者state内容发生改变的时候，会进行重新渲染组件，但是PureComponent的话，只有当对象本身的引用发生改变的时候才会去更新视图层。如果不希望重新渲染的话，后者性能会高。

PureComponent实现了shouldComponentUpdate方法，而Component没有实现，需要使用者去实现它。

### 事件系统

SyntheticEvent，即综合事件，React中在component中进行定义的事件都是基于这个综合事件来的，并且具有自己的池化技术。同时只在document标签中进行挂载事件，然后等到冒泡到document事件的时候进行分发，提高性能。