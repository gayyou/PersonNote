# Go语言的接口与其他语言接口的不同

## 1.接口类型

### 侵入式接口

​	以往的传统语言的接口的定义一般来说都是侵入式接口，侵入式接口最大的特点是这个接口一旦定义，所有实现这个接口的类一定要完全实现该接口，不能多也不能少，完全是按照这个接口的标准来进行开发。不满足实现的接口定义的方法，则会进行报错。如`TypeScript`中的接口的定义以及实现：

```js
interface User {
  login(user: User): void
  regist(user: User): void
}

class FileUserImpl implements User {
  login(user: User): void {
    // code...
  }
  
  regist(user: User): void {
    // code...
  }
}
```

如果一个想要去实现一个接口，那么它就要从这个接口上进行继承（**也许它在这个接口上的某一个方法是不需要的，也要完全继承下来**）。这就是侵入式接口，缺点很明显，就是不灵活。

### 非侵入式接口

Go语言的接口的实现是非侵入式接口，何为非侵入式接口呢？我们可以先看看go语言的接口。

```go
type File struct {
  // ...
}

func (f *File) Read(buf []byte) (n int, err error)
func (f *File) Write(buf []byte) (n int, err error)
func (f *File) Seek(off int64, whence int) (pos int64, err error)
func (f *File) Close() error
```

这里我们定义了一个`File`类，并且具有四个方法。接下来我们来定义一下接口。

```go
type IFile interface {
  Read(buf []byte) (n int, err error)
  Write(buf []byte) (n int, err error)
  Seek(off int64, whence int ) (pos int64, err error)
  Close() error
}

type IReader interface {
  Read(buf []byte) (n int, err error)
}
```

这样我们的接口就定义完毕了，这里没有特别明显的接口继承的语法，所以到目前为止，下面的两个接口和上面的类以及类定义的方法没有什么关系。那么在什么时候就会有关系呢？那就是在声明的时候就会产生联系。

```go
var file1 IFile = new(File)
var file2 IReader = new(File)
```

编译器在运行到这里的时候，会自动判断`File`有没有实现了`IFile`或者`IReader`接口定义的所有内容，（注意一下这里是实现了，不一定是完全等同于接口定义的方法。**只要接口是这个类的子集就够了**）。判断完后编译的时候会将接口中方法的引用指向实现了这个接口的类的方法。这个过程就是非侵入式接口。

### 侵入式接口和非侵入式接口的区别

可以简单用一句话说明：

- 侵入式接口是先由接口后有类
- 非侵入式接口是先由类后有接口

****

## 2.接口赋值

接口可以由以下的两个办法来进行赋值：

- 对象实例赋值给接口
- 接口赋值给接口

### 对象实例赋值给接口

​	把对象实例赋值给接口的话，要求这个对象实例实现了接口的所有的方法。将对象实例进行赋值给接口的时候，需要赋值这个对象的地址。

```go
type Integer int

func (a Integer) Less(b Integer) bool {
  return a = b
}

func (a *Integer) Add(b Integer) {
  *a += b
}

var a Integer = 1
var b LessAdder = &a  ...(1)
var b LessAdder = a   ...(2)
```

以上的实例赋值给接口中，只有1能够运行，原因是Go可以根据以下的函数

```go
func (a Integer) Less (b Integer) bool
// 生成
func (a *Integer) Less (b Integer) bool {
  return (*a).Less(b)
}
```

但是不能自动构造以下的函数

```go
func (a *Integer) Add(b Integer)

// 生成

func (a Integer) Add(b Integer) {
  (&a).Add(b)
}
```

这是因为GO语言传参是按值来传参的，如果你传的内容是一个对象实例，那么传过来的是这个实例的复制品，获取这个复制品的地址也并不能够修改传进来的对象实例。所以需要传进来对象实例的地址才能够进行接口的赋值。

### 接口赋值给接口

首先，接口赋值的条件就是被赋值接口的方法是赋值接口的方法的子集。

```go
type Inter1 interface {
  func (f *File) Read(buf []byte) (n int, err error)
}

type Inter2 interface {
  func (f *File) Read(buf []byte) (n int, err error)
}

var n1 Inter1 = new(File)
var n2 Inter2 = n1
var n3 Inter1 = n2
```

上面的接口赋值能够成立的条件是能够满足Inter1接口的实例，它就能够满足inter2。反过来也是一样的。

接口给接口赋值不一定要是两个接口都是一样的，需要的条件就是**被赋值接口的方法是赋值接口的方法的子集**。

