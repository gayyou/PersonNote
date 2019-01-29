# Generator函数的语法

### Generator简介

Generator是ES6提供的一种异步编程的解决方案，语法的行为与普通的函数完全不一样，内部是基于Iterator遍历器实现的。

执行Generator返回的永远只能是遍历器对象，即一个指针，（无论函数末尾是否有返回值）。也就是，Generator除了是状态机，还是一个遍历器对象，返回的遍历器对象是状态机中的每一个状态。

形式上，Generator是一个普通函数，但是有两个特征：一是function命令与函数名之间有个*号；二是函数体内部使用yield语法。下面是使用generator的实例代码：

```javascript
function* helloWorld() {
    yield 'hello';
    yield 'and';
    yield 'world';
}

let hw = helloWorld();

hw.next();	// hello
hw.next();	// and
hw.next();	// world
```

#### yield表达式

Generator函数返回的遍历器对象只有调用next方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数，yield是暂停的标志。

对象的next方法则是执行下一步操作，直到遇到另外一个yield语句。

遍历器next方法的运行逻辑如下：

- 遇到yield语句就暂停执行后面的操作，并将紧跟在yield后的表达式的值作为返回对象的Value值返回。
- 下一次调用next方法时再继续往下执行，直到遇到下一条yield语句。
- 如果没有再遇到yield语句，就一直运行到函数结束，直到return语句为止，并将return的值作为返回对象的value属性值。
- 如果这个函数没有return语句的时候，返回对象的value值为undefined。

注意：只有调用next方法且内部具有yield语句时候才会执行yield语句后面的表达式，因此等于为JavaScript提供手动惰性求值的语法功能。并且yield表达式只能在Generator函数内使用，其他函数内使用会报错。

****



### Generator与Iterator接口的关系

任意一个对象的Symbol.iterator方法等于这个对象的遍历器对象生成函数，调用该函数会返回一个遍历器对象。这个遍历器对象指的是Generator返回的指针，即只是在这个对象上寄生的方法。示例代码如下：

```JavaScript
let myIterable = {};

myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
}

[...myIterable];	// [1, 2, 3]
```

函数Generator执行完毕后，总会返回一个遍历器对象，这个遍历器对象的遍历器方法（Symbol.iterator）执行后总是指向**本身**。示例代码如下：

```javascript
function* gen() {
    // some code
}

let g = gen();

g === g[Symbol.iterator]();	// true
```

****



### next方法的参数及其返回值

next方法的返回值总是一个对象，这个是和Iterator遍历器对象的next方法返回值是一样的，而在Generator中，next方法的返回值是yield语句后面表达式的结果，除了第一次调用next方法外，都是具有返回值的。

yield语句是没有返回值的，或者说返回值是undefined。而在Generator返回的遍历器对象的next方法的参数会作为yield语句的返回值。示例代码如下：

```JavaScript
function* f() {
    for (let i = 0; true; i++) {
        let reset = yield i;
        if (reset) {
            i = -1;
        }
    }
}

let g = f();

g.next();	 // 0
g.next();	 // 1
g.next(true) // 0
```

解释一下上面的代码，上面的f函数定义了一个可以永久执行的Generator状态机，next的返回值是reset，如果next不带参数的话，返回值永远是undefined，所以下面的判断语句是不会生效的，所以next的返回值对象的value值会一直递增，如果next中带一个参数true，则i会被重置，所以得到的返回值为0（-1+1 = 0）。

注意：上述过程可以自己脑补，next语句执行后，会在下一个yield语句前停住，将这个yield语句后面的表达式计算完毕作为next的返回值，而next的参数会是上一个yield语句的返回值。那么有人可能会问了，第一次调用next前面是没有yield语句的？对，所以第一次调用next的时候，有带参数V8引擎也会自动忽略。

这个功能具有很重要的意义，也会说明，Generator函数从暂停状态到回复运行，其上下文（context）是不变的，通过next方法的参数就有办法在Generator状态机中注入新的变量，达到调整这个函数的行为的功能。下面这个例子可以帮助你理解Generator函数。

特别说明一下，在Generator函数中，如果有return语句，则这个return语句的返回值会作为最后一次有效调用next方法的返回值(即value为返回值的内容，done为true)。

```JavaScript
function* foo(x) {
    let y = 2 * (yield (x + 1));
    let z = yield (y / 3);
    return (x + y + z);
}

let a = foo(5);
a.next();	// 6
a.next();	// NaN
a.next();	// NaN

let b = foo(5);
b.next();	// 6
b.next(12);	// 8
b.next(13);	// 42
```

理解了上面的代码就能够理解next和yield的执行细节了。

****

### for...of循环

for...of循环可以自动遍历Generator函数生成的Iterator对象，且此时不需要再调用next方法。但是与手动一个一个调用next循环不同，for...of并不会返回return语句后面的表达式的值。

应为Generator对象执行完毕后会返回一个遍历器对象指针，则Iterator对象可以用的方法这个指针对象都可以用。比如用...扩展运算符、Array.from、解构赋值等。

