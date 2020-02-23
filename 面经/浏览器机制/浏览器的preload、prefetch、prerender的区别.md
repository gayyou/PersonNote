# 提高浏览器性能-preload、prefetch、prerender

### 1.preload

`preload`是浏览器的一种预加载资源模式，它的作用是将资源率先加载，然后等到需要的时候再去使用，是一种资源的加载和解析解耦的方法。它有如下特点：

1. 具有优先级，但是并不会阻塞`onload`事件：`preload`在网页中具有强制加载的功能，所以它的加载具有优先级，不过它仅仅是加载资源而已，并不会执行，还需要`script`资源进行加载。
2. 它设计的目的是为当前页面的资源进行预加载，跳转页面的时候就不会使用到。
3. 使用as字段来进行设定优先级，如`as=style`则为最高优先级。优先级顺序为：`HTML/CSS>Images>JS`

### 2.prefetch

相比于`preload`，`prefetch`的是在**浏览器空闲的时候**再进行加载，它更关注网页初始化完毕后进行加载的资源或者打开另外一个网页的时候加载的资源。不过prefetch要加载跨域资源的时候需要有`crossorigin`字段

1. 它可能是一件坏事，因为加载的内容可能不会使用到
2. 利用空闲时间再进行加载
3. 也是实现加载和解析相反的功能

相比于`preload`，`prefetch`有更多中选择，有`dns-prefetch`、`prerender`。

- `dns-prefetch`：对于DNS在幕后进行解析为IP地址（在手机端会哟较大的作用）
- `prerender`：对于将要进行加载的网页进行预执行，并且加载很多资源（会耗费带框）慎用。

缺点：

1. 资源浪费，因为`prefetch`是可能会出现的。所以会存在一些资源加载了并不会使用

```
<link rel="prefetch" href="/uploads/images/pic.png">
```

```
 <link rel="dns-prefetch" href="//fonts.googleapis.com">
```

```
<link rel="prerender" href="https://www.keycdn.com">
```

### 3.preconnect

允许**HTTP发送请求前的操作进行预操作，比如说解析DNS、建立SSL，建立TCP握手**，这样一旦请求的话可以直接进行发送请求，

```html
<link href="https://cdn.domain.com" rel="preconnect" crossorigin>
```

### 4.相同的特点

1. 如果需要跨域，那么要使用 `crossorigin`字段。
2. 都是属于勤快优化类型，将数据的加载和数据的使用/解析分开。

### 5.不同点

1. 在A页面通往B页面的时候，`preload`会失效，而`prefetch`并不会失效。
2. `preload`可以用as来指明加载的类型，从而设置优先级，但是`prefetch`却不可以