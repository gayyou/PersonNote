# Iterator迭代器

### Iterator简介

Iterator提供一个抽象的迭代器，为不同的数据结构进行迭代遍历。一个数据结构要能够通过Iterator进行迭代的前提是这个数据结构部署了Symbol.iterator方法。Symbol的话也是ES6的新添加的对象之前有介绍，这里就不进行介绍了。

Iterator的遍历过程如下：

- 创建一个指针对象，指向当前数据结构的其实位置（并不是第一个数据的位置，类似于带头节点的链表的头节点），也就是说，遍历器对象实质上是一个指针对象。
- 第一次调用next方法，会指向数据结构的第一个成员并返回。
- 第二次调用next方法，会指向数据结构的第二个成员并返回。
- 不断调用next会继续将指针往后挪，直到指向数据结构的结束位置，停止爱。
- 每次调用返回是一个对象，这个对象有两个属性分别是value和done。value代表当前的数据的值，如果是结束的话，会是undefined。done代表遍历是否结束，不结束的话，是false，结束的话是true。

****

### 默认Iterator接口

Iterator接口部署在数据结构的Symbol.iterator属性，换句话说，如果一个对象具有Symbol.iterator属性，则这个对象是可遍历的（iterable）。可遍历对象的实例代码如下：

```JavaScript
const obj = {
    [Symbol.iterator] : () => {
        return {
            next: () => {
                return {
                    value: 1,
                    done: false
                }
            }
        }
    }
}
```

上述对象的obj是可遍历的，因为其具有[Symbol.iterator]属性，执行这个属性回访回一个遍历指针对象，该对象的根本特征就是具有next方法，所以如果我们自己定义一个这样的可遍历属性的话，一定要具有next方法。

ES6具有一些原生的对象已经部署了Iterator遍历器，它们分别是

- Array
- Map
- Set
- String
- TypedArray
- 函数的arguments对象
- NodeList对象

下面是数组Array的遍历代码：

```JavaScript
let arr = [1, 2, 3, 4, 5, 6 ,7];
let iter = arr[Symbol.iterator]();
for (let item of iter) {
  console.log(item)
}
/*
for (let item of arr) {
  console.log(item)
}
*/
// 1
// 2
// 3
// 4
// 5
// 6
// 7
```

上面无论是对数组arr进行遍历，还是对其遍历指针进行for...of遍历，都是同样的结果。

上面是具有Symbol.iterator属性的对象的遍历，下面是如何部署一个Iterator。实例代码如下：

```JavaScript
class RangeIterator {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    if (this.start <= this.end) {
      return {
        value: this.start++,
        done: false
      };
    } else {
      return {
        value: undefined,
        done: true
      }
    }
  }
}

let rage = new RangeIterator(1, 5);
let iter = rage[Symbol.iterator]();
for (let item of iter) {
  console.log(item);
}
// 1
// 2
// 3
// 4
// 5
```

上面是在这个函数构建的对象中部署遍历器，能够遍历输出一定范围的数字，这种是通过类来进行部署Iterator遍历器。

对于类似于数组的类数组对象（具有长度和数值键名（即可以通过下标访问的））可以直接引用数组的Iterator接口，代码如下：

```javascript
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

[...document.querySelectorAll('div')]  // 可以执行的
```

对数组进行解构赋值的时候，会默认调用这个数组的Iterator方法。所以可以通过上面的方法进行部署遍历对象。

但是部署这个遍历器的如果是个普通对象，则不能够进行遍历，因为遍历器进行遍历要能够获得键值，一般数组的键值是数字，可以通过自增获得键值，但是普通对象是一个无序的键值对，所以没法通过遍历器进行遍历。

****

### 调用Iterator接口的场合

有些场合会默认用到Iterator接口，除了for...of之外，有以下场合会用到Iterator接口。

- 解构赋值：对数组和Set结构进行解构赋值的时候，会默认调用Symbol.iterator方法

- 扩展运算符：扩展运算符（...）也会默认调用Iterator接口。例子如下

  ```javascript
  let str = 'hello';
  [...str] // ['h', 'e', 'l', 'l', 'o']
  ```

  实际上，这提供了一种简便机制，可以将任何部署了Iterator接口的数据结构转为数组，也就是说，只要某个数据结构部署了Iterator接口，就可以对它使用扩展运算符，将其转为数组。

  ```JavaScript
  let arr = [...iterable];
  ```

- yield*：yield后面跟 是一个可遍历的结构，它会调用该结构的遍历接口。

  ```JavaScript
  let generator = function* () {
      yield 1;
      yield* [2, 3, 4];
      yield 5;
  }
  
  let iterator = generator();
  
  for (let item of iterator) {
      console.log(item)
  }
  ```

  

