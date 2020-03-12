[TOC]

#### 1.数组中重复的数字

给出一组数据，n个，数字都是从1-n-1中出现，有2种问法：

- 找出所有的重复数字：使用hashMap来解决
- 只需要找出一个数字即可：第二种问法和第二道类型题一致

```js
const isUndef = tar => typeof tar === 'undefined' || tar === null;

const isDef = tar => !isUndef(tar);

const resolution = (arr) => {
  if (isUndef(arr) || arr.length === 0) {
    return [];
  }

  for (let i = 0; i < arr.length; i++) {
    // 将正确的数字放在正确的位置上面
    if (i !== arr[i]) {
      let value = arr[i];
      if (value !== -1 && arr[value] === value) {
        return value;
      }

      [arr[value], arr[i]] = [arr[i], arr[value]];
      i--;
    }
  }

  return -1;
};
```

- 如果是不能够改变原数组的情况下来，并且也是n个数字（1->n - 1）中存在一个数字出现重复，该数字重复次数不一定是2次。并且要求使用额外空间为1，此时不能够修改原数组的话，只能使用龟兔赛跑

```js
const resolution2 = (arr) => {
  if (isUndef(arr) || arr.length === 0) {
    return [];
  }

  // 思路是将数组走过的位置连起来，那么可以理解为一个链表，
  // 并且数组永远在数组内部进行走动（因为取值范围的原因），那么
  // 终究走过的路会成一个环，如果是一条成环的链表，那么找到成环的入口只能用快慢法
  // 为什么要说成环的入口，因为只有重复的数字才会走多次到那个点
  // 所以走过的路径可以看做一个存在换的链表

  let value1 = arr[0];
  let value2 = arr[0];

  do {
    // 一个走得快，一个走得慢。然后先让走得快
    value1 = arr[value1];
    value2 = arr[arr[value2]];
    // 注意相遇点并不一定是成环点
  } while(value2 !== value1);

  let start = arr[0];

  while (start !== value1) {
    // 再走一遍就能找到成环点
    start = arr[start];
    value1 = arr[value1];
  }

  return start;
};
```

- 换种想法，类似于二分查找的方式，进行递归查看某段数字在整个数组出现的次数，然后通过对出现的数字段进行二分拆解的方式来查。

#### 2.寻找二维排序数组目标数

二维数组中，每个数的右边和下边数字大于等于本身数字，现在给出这样的二维数组，还有一个目标数，寻找目标数是否存在于二维数组中。

```js
const isUndef = tar => typeof tar === 'undefined' || tar === null;

const isDef = tar => !isUndef(tar);

const resolution = (matrix, tar) => {
  if (isUndef(matrix) || matrix.length === 0) {
    return -1;
  }

  let j;
  let rowLength = matrix[0].length;
  let preI = 0, preJ = 0;

  for (let i = 0; i < matrix.length; i++) {
    j = i < rowLength ? i : rowLength - 1;

    if (matrix[i][j] <= tar) {
      preI = i;
      preJ = j;
    } else {
      break;
    }
  }

  for (let i = preI; i < matrix.length; i++) {
    if (matrix[i][preJ] === tar) {
      return true;
    }
  }

  for (let j = preJ + 1; j < rowLength; j++) {
    if (matrix[preI][j] === tar) {
      return true;
    }
  }

  return false;
}
```

分析：最后可以看出时间复杂度是n，首先寻找对角线，每次进位的时候，相当于横着进一位，然后最后把横着的数字走完，所以是n。

#### 3.替换字符串中的空格

将字符串中的所有空格替换成为%20这样的符号。

思路：首先遍历一遍，知道空格的个数，然后再将这个字符串进行延长？（C和C++可以这么做，但是js的话就直接创造一个新的数组，然后转为字符串）。

```
const Resolution = (node) => {
  if (isUndef(node)) {
    return ;
  }

  Resolution(node.next);
  console.log(node.val);
};
```

#### 4.遍历二叉树

使用栈来先序、中序、后序遍历二叉树，并且层序遍历二叉树

- 层序遍历

```js
const Resolution = (root) => {
  if (isUndef(root)) {
    return false;
  }

  let prePoint = root, postPoint = root;
  let queue = [root];
  let printMessage = '';

  while (queue.length !== 0) {
    let item = queue.shift();
    if (item.left) {
      queue.push(item.left);
      postPoint = item.left;
    }

    if (item.right) {
      queue.push(item.right);
      postPoint = item.right;
    }

    printMessage += ' ' + item.val;

    if (prePoint === item) {
      // 两个节点相同的时候输出存储的message，并且更换prePoint
      prePoint = postPoint;
      console.log(printMessage);
      printMessage = '';
    }
  }
};
```

- 先序遍历

```js
function preOrder(root) {
    if (isUndef(root)) {
      return ;
    }

    let stack = [];
    let result = [];
    let temp = root;

    while (isDef(temp) || stack.length !== 0) {
      while (isDef(temp)) {
        // 如果temp存在的话，进行加进栈中
        stack.push(temp);
        result.push(temp.val);
        temp = temp.left;
      }

      temp = stack.pop().right;
    }

    return result;
  }
```

- 中序遍历

```
function midOrder(root) {
    if (isUndef(root)) {
      return ;
    }

    let stack = [];
    let result = [];
    let temp = root;

    while (isDef(temp) || stack.length !== 0) {
      while (isDef(temp)) {
        // 如果temp存在的话，进行加进栈中
        stack.push(temp);
        temp = temp.left;
      }

      temp = stack.pop();
      result.push(temp.val);
      temp = temp.right;
    }

    return result;
  }
```

- 后序遍历

```
function postOrder(root) {
    // 后续遍历的时候，需要有一个指针来进行判断出来防止重复操作，
    if (isUndef(root)) {
      return ;
    }

    let stack = [];
    let result = [];
    let temp = root;
    let preNode = null;

    while (temp != null || stack.length !== 0) {
      while (temp != null) {
        stack.push(temp);
        temp = temp.left;
      }

      temp = stack.pop();

      if (isDef(temp.right) && temp.right !== preNode) {
        // 说明右边没有遍历过,先将右边压栈
        stack.push(temp.right);
        temp = temp.right;
      } else {
        // 不存在右边，或者右边遍历过，那么进行搜集当前节点，
        // 右边有遍历过那么轮到当前节点的，需要将当前节点入栈，并且置空，然后preNode设为当前节点
        preNode = temp;
        result.push(temp.val);
        temp = null;
      }
    }

    return result;
  }
```

#### 5.二叉树中序遍历的下一个结点

给出一个含有左右结点、父亲结点指针的树，要怎么进行处理呢?

首先分析一下，这个结点的下一个结点有几种情况？

- 右子树的最左结点，可能是回溯过程中，右边结点存在
- 父亲结点（深度回溯的结点）
- 该结点存在于第一个父亲结点的左树中

```
const Resolution = (node) => {
  if (node === null) {
    return null;
  }

  if (node.right != null) {
    let right = node.right;

    while (right.left != null) {
      right = right.left;
    }

    return right;
  } else if (node.parent != null) {
    let cur = node;
    let parent = node.parent;

    while (parent != null && parent.right === cur) {
      cur = parent;
      parent = parent.parent;
    }

    return parent;
  }

  return node.parent;
};
```

#### 6.两个栈实现队列，两个队列实现栈

- 注意到一点，两个栈实现队列的时候，不需要每次都把压进第二个栈数据倒回来
- 两个栈实现队列的时候，需要进行栈变量指针的切换

```js
// 两个栈实现队列
class Queue {
  constructor() {
    this.stack1 = [];
    this.stack2 = [];
  }

  addQueue(elm) {
    this.stack1.push(elm);
  }

  popQueue() {
    if (this.stack2.length === 0) {
      while (this.stack1.length !== 0) {
        this.stack2.push(this.stack1.pop());
      }
    }

    if (this.stack2.length === 0) {
      return null;
    }

    return this.stack2.pop();
  }
}

let queue = new Queue();

queue.addQueue(1);
queue.addQueue(2);
queue.addQueue(3);
queue.addQueue(4);
queue.addQueue(5);

console.log(queue.popQueue());
console.log(queue.popQueue());
console.log(queue.popQueue());
console.log(queue.popQueue());

queue.addQueue(1);
console.log(queue.popQueue());
console.log(queue.popQueue());
console.log(queue.popQueue());

// 两个队列实现栈
class Stack {
  constructor() {
    this.queue1 = [];
    this.queue2 = [];
  }

  push(elem) {
    this.queue1.push(elem);
  }

  pop() {
    if (this.queue1.length === 0) {
      return null;
    }

    while (this.queue1.length > 1) {
      this.queue2.push(this.queue1.shift());
    }

    [this.queue1, this.queue2] = [this.queue2, this.queue1];

    return this.queue2.shift();
  }
}

let stack = new Stack();

stack.push(1);
stack.push(2);
stack.push(3);
stack.push(4);
stack.push(5);
stack.push(6);

console.log(stack.pop());
console.log(stack.pop());
console.log(stack.pop());
console.log(stack.pop());
```

#### 7.旋转数组的最小值

- 注意：需要处理当left , right, mid相同的时候，只能乖乖去遍历

  ```js
    if (arr === null || arr.length === 0) {
      return false;
    }
      
    if (arr.length == 1) {
        return arr[0];
    }
      
      function orderFind(arr, left, right) {
          for (let i = left + 1; i <= right; i++) {
              if (arr[i] < arr[i - 1]) {
                  return arr[i];
              }
          }
          
          return arr[left];
      }
  
    let left = 0;
    let right = arr.length - 1;
    let midIndex = 0;
  
    while (arr[left] >= arr[right]) {
      if (right - left == 1) {
        midIndex = right;
        break;
      }
        
      // 乖乖去遍历
      if (arr[midIndex] == arr[left] && arr[left] == arr[right]) {
          return orderFind(arr, left, right);
      }
  
      midIndex = Math.floor((left + right) / 2);
      if (arr[midIndex] >= arr[left]) {
        left = midIndex;
      } else if (arr[midIndex] <= arr[right]) {
        right = midIndex;
      }
    }
  
    return arr[midIndex];
  ```

#### 8.在矩阵中找到目标的路径，可以上下左右进行移动

- 需要有一个二维数组来进行记录状态
- 进行广度优先搜索+回溯法
- 回溯法一定要递归操作。

```
const Resolution = (matrix, str) => {
  if (matrix === null || matrix.length === 0 || str === null || str.length === 0) {
    return false;
  }

  function findPath(matrix, str, i, j, strIndex, visited) {
    if (strIndex === str.length) {
      return true;
    }

    if (i < 0 || i >= matrix.length || j < 0 || j >= matrix[0].length) {
      return false;
    }


    if (matrix[i][j] != str[strIndex] || visited[i][j]) {
      return false;
    }

    visited[i][j] = true;

    let hasPath = findPath(matrix, str, i - 1, j, strIndex + 1, visited)
      || findPath(matrix, str, i + 1, j, strIndex + 1, visited)
      || findPath(matrix, str, i, j - 1, strIndex + 1, visited)
      || findPath(matrix, str, i, j + 1, strIndex + 1, visited);

    if (!hasPath) {
      visited[i][j] = false;
    }

    return hasPath;
  }

  let result = false;
  let visited = new Array(matrix.length);
  for (let i = 0; i < visited.length; i++) {
    visited[i] = new Array(matrix[0].length).fill(false);
  }

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j] === str[0]) {
        result = findPath(matrix, str, i, j, 0, visited);

        if (result) {
          return true;
        }
      }
    }
  }

  return false;
};
```

#### 9.机器人的活动范围

- 地上有一个m行n列的方格，从坐标 [0,0] 到坐标 [m-1,n-1] 。一个机器人从坐标 [0, 0] 的格子开始移动，它每次可以向左、右、上、下移动一格（不能移动到方格外），也不能进入行坐标和列坐标的数位之和大于k的格子。例如，当k为18时，机器人能够进入方格 [35, 37] ，因为3+5+3+7=18。但它不能进入方格 [35, 38]，因为3+5+3+8=19。请问该机器人能够到达多少个格子？
- **注意**：这道题的坑点在于有些方格是不能直接到达的，需要使用深度或者广度优先遍历来进行遍历。

```
  if (m <= 0 || n <= 0) {
    return 0;
  }

  function getCount(a) {
    let sum = 0;
    while (a != 0) {
      sum += a % 10;
      a = parseInt(a / 10);
    }

    return sum;
  }

  function go(m, n, i, j, k, visited) {
    if (i < 0 || i >= m || j < 0 || j >= n) {
      return false;
    }

    if (visited[i][j] || getCount(i) + getCount(j) > k) {
      return false;
    }

    visited[i][j] = true;
    count++;
    go(m, n, i - 1, j, k, visited);
    go(m, n, i + 1, j, k, visited);
    go(m, n, i, j - 1, k, visited);
    go(m, n, i, j + 1, k, visited);
  }

  let count = 0;
  let visited = new Array(m);
  for (let i = 0; i < visited.length; i++) {
    visited[i] = new Array(n).fill(false);
  }

  go(m, n, 0, 0, k, visited);

  return count;
```

#### 10.剪绳子

- 给你一根长度为 n 的绳子，请把绳子剪成整数长度的 m 段（m、n都是整数，n>1并且m>1），每段绳子的长度记为 k[0],k[1]...k[m] 。请问 k[0]*k[1]*...*k[m] 可能的最大乘积是多少？例如，当绳子的长度是8时，我们把它剪成长度分别为2、3、3的三段，此时得到的最大乘积是18。

- ### 本题可用动态规划，自底向上，然后很简单。。

```
if (n <= 2) {
    return 1;
  }
    
  if (n == 3) {
      return 2;
  }

  let threeCount = n / 3;
  let resultLen = n % 3;
  let result = 1;

  if (resultLen === 1) {
    threeCount--;
    resultLen = 4;
  } else if (resultLen === 0) {
    resultLen = 1;  // 等于0的情况下不能相乘，所以换成1
  }

  let base = 3;
  // 使用快速幂
  for (; threeCount !== 0; threeCount >>= 1) {
    if ((threeCount & 1) === 1) {
      // 如果当前位存在的话
      result *= base;
    }
    base *= base;
  }

  result *= resultLen;
  
  return result;
```

#### 11.二进制中1的个数

- 使用位运算

一开始思路肯定是向右边移位运算，但是存在问题，如果是一个负数的话，会陷入死循环，所以我们要改变思路,使用一个flag初始值位1进行向左移位，然后移动到一定位数后，会置为0

```js
var hammingWeight = function(n) {
  let count = 0;
  let flag = 1;
  while (flag) {
    if ((n & flag)) {
      count++;
    }
    
    flag <<= 1;
  }
  
  return count;
};
```

#### 12.不使用加法进行加法操作

- 使用位运算
- 使用异或来记住不需要进位的位数，使用逻辑与运算记住需要进位的数字

```js
const Resolution = (n1, n2) => {
  let add, carry;
  do {
    // 首先将不能进位的操作记起来
    add = n1 ^ n2;
    carry = (n1 & n2) << 1;
    n1 = add;
    n2 = carry;
  } while (n2 !== 0);

  return n1;
};

```

#### 13.股票的最大利润

