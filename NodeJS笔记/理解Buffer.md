[TOC]

# 理解Buffer

​	Buffer是典型的C++和JavaScript结合的模块，将性能部分由C++实现，非性能部分由JavaScript实现，用户通过js控制C++中Buffer的内存，所以Buffer中的内存并不存在于js的堆中，即不占用堆内内存。

### Buffer对象

​	Buffer对象类似于数组，它是由两位的16进制数组合而成的，范围是0-255。如果纯英文的话，一个字符转为Buffer对象的话只是占一个字符的，但是如果是utf-8等中文的话，一个中文字符在Buffer中要占用3个字符，这就有可能造成Buffer对象转回js对象的时候出现乱码（毕竟要完整的三个字符才能构造一个中文字符）。

### Buffer内存分配

​	Buffer独享的内存分配并不存在于V8的堆内存中，而是在Node的C++层面实现内存的申请的。Node实现由C++层面申请内存，在js层面进行控制的策略。

​	Node采用的是slab分配机制，slab是一种动态内存管理机制，slab有以下三种状态：

- full：完全分配状态
- partial：部分分配状态
- empty：没有被分配状态

**分配小的Buffer**

​	如果指定的Buffer小于8KB，Node会按照小对象的方式进行分配，小的Buffer在分配中遵循以8KB为申请单位，尽量节约资源的形式。如果申请一个一字节的Buffer，C++还是会申请8KB，然后下次如果申请3KB的Buffer，会在一个字节那里继续放下这个3KB的Buffer。直到申请的空间大于剩下的空间，此时会再次申请一个8KB的空间存放。

**分配大Buffer**

大Buffer的空间只能够存放一个Buffer对象。

------

### Buffer的转换

Buffer目前支持的编码类型有以下几种

- ASCII
- UTF-8
- UTF-16LE/UCS-2
- Base64
- Binary
- Hex

#### 字符串转Buffer

```JavaScript
new Buffer(str, [encoding]);  // 第二个参数为编码格式
```

#### Buffer转字符串

Buffer转字符串的时候直接调用toString()方法即可。

------

### Buffer的拼接

Buffer在使用中是一段一段的方式进行传输的，国外常见的代码如下：

```JavaScript
const fs = require('fs');
let rs = fs.createReadStream('test.md');
let data = '';
rs.on('data', (chunk) => {
    data += chunk;
});
rs.on('end', () => {
    console.log(data);
})
```

这个读取方法在全英语的外国是可以用的，但是在非全英语的时候却可能导致乱码，为什么呢？

举个例子吧！

“人生是一场难得的修行，不要轻易交白卷！”

这个字符串中全是中文字符，将上面的代码改一句代码，然后读取后会出现问题

```javascript
let rs = fs.createReadStream('test.md', { highWaterMark: 11 });
```

`人生是��场难得���修行，不要轻��交白卷���`

这个结果，为什么会出现这个结果呢，我们先对转为字符串之前的buffer进行打印，结果如下

![1547522034659](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1547522034659.png)

这个是由于设定了highWaterMark，每次读取的时候读取11个16进制数，而中文字符占3个16进制数，所以在一这个时候会发生断层。没法读取出一，反而读取处两个问号。

如果不限制Buffer的读取长度，系统也会加以限制的，这样一旦文件超过Buffer的读取长度，就有可能会出出现乱码。这样明显不好。

**解决方案**

1. 用setEncoding和string_decoder方法：

```JavaScript
let rs = fs.createReadStream('test.md', { highWaterMark: 11 });
rs.setEncoding('utf-8');
```

这种方法的作用是在fs的createReadStream方法中传输的不是一个Buffer对象，而是编码后的字符串。这样就避免了Buffer读取时候出现乱码。

这是因为在读取文件的内部中，存在着一个encoder对象，这个对象对Buffer的内容进行编码，然后得到的是编码后的结果。在进行读取的时候还是会出现断层现象，只不过这个encoder会以3位为一个单位进行解码，即遇到最后2位的时候会保存下来，等到下一次凑够三位的时候进行解码。这样就不会出现乱码。但是这种方法还是会出现断层现象。

2. 正确拼接Buffer的方法

淘汰掉上面的方法后，思路只能从由多个小的Buffer对象进行拼接成一个大的Buffer对象。此时可以调用Buffer.concat方法，进行字符串的拼接。



