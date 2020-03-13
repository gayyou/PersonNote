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

- 使用贪婪法，记住股票的最低价，然后遇到一个价位的股票就去比较大小

```js
var maxProfit = function(priceArray) {
  if (priceArray === null || priceArray.length === 0) {
    return 0;
  }

  let maxProfit = 0, minPrice = Infinity;

  for (let i = 0; i < priceArray.length; i++) {
    minPrice = Math.min(minPrice, priceArray[i]);

    maxProfit = Math.max(maxProfit, priceArray[i] - minPrice);
  }
  
  return maxProfit;
};
```

#### 14.圆圈中的最后的数字

- 待定

#### 15.扑克牌中最大的顺子

```js
var isStraight = function(arr) {
  let container = new Array(14).fill(0);

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0 && container[arr[i]] >= 1) {
      return false;
    }
    container[arr[i]]++;
  }

  let isInOrder = false;
  let orderLen = 0

  for (let i = 1; i < container.length; i++) {
    if (container[i] != 0 && !isInOrder) {
      isInOrder = true;
    }

    if (isInOrder) {
      if (container[i] === 0) {
        if (container[0] == 0 && orderLen < arr.length) {
            return false;
        } else {
            container[0]--;
        }
      }

      orderLen++;
    }
  }

  return true;
};
```

#### 16.骰子出现所有值的概率



#### 17.最小值栈和最大值队列

- 最小值栈使用多一个栈来实现，思路是如果压进栈中的值小于栈顶的值，那么就进行压入最小值栈
- 最大值队列需要多一个双端队列来进行设定为最大值，滑动窗口思路。

#### 18.滑动窗口的最大值

- 使用双端队列来进行滑动窗口操作
- 对于插入队列端，只要顶部的值小于元素，就出栈操作。

```js
var maxSlidingWindow = function(arr, k) {
  if (arr === null || arr.length === 0) {
    return [];
  }

  let deque = [];

  function peekTop(deque) {
    return deque[deque.length - 1];
  }

  let result = [];

  for (let i = 0; i < k; i++) {
    while (deque.length !== 0 && arr[peekTop(deque)] < arr[i]) {
      deque.pop();
    }

    deque.push(i);
  }

  for (let i = k - 1; i < arr.length; i++) {
    while (deque[0] <= i - k) {
      deque.shift();
    }

    while (deque.length !== 0 && arr[peekTop(deque)] < arr[i]) {
      deque.pop();
    }

    deque.push(i);
    result.push(arr[deque[0]]);
  }

  return result;
};
```

#### 19.连续数字和为目标数

- 找出所有值连续和为目标的正数数组
- 思路1
  - 从0 - n/2，中，有且仅有一个数组长度为i的数组和为tar。
- 思路2
  - 使用双指针法拉扯，如果和小于tar，那么往右延伸
  - 如果和大于tar，左边进行收缩
  - 如果和为目标值，进行添加至结果集，并且left和right都往右边挪一位

#### 20.只出现一次的数字

- 对于其他数字都出现偶数的条件下，直接遍历然后进行与运算

- 如果其他数字是出现奇数的情况，那么要将每个数字的所有bit位进行相加，然后判断结果的比特位是否为0来进行与结果相加，不过可以通过异或操作来与结果进行合并。代码如下

  ```js
  var singleNumber = function(arr) {
      if (arr === null || arr.length === 0) {
      throw new Error('Array is Not Null');
    }
    
    let res = 0;
  
    for (let i = 0; i < 32; i++) {
      let sum = 0;
      for (let j = 0; j < arr.length; j++) {
        sum +=  (arr[j] >> i) & 1;  // 进行处理某一位
      }
  
      res ^= (sum % 3) << i;   // 使用异或和移位运算，结果来进行合并
    }
    
    return res;
  };
  ```

#### 21.判断一棵树是否是平衡二叉树

```js
const IsABBST = (node) => {
  if (node === null) {
    return {
      height: 0,
      isBBST: true
    }
  }

  let maxHeight = 0;
  let factory = 0;

  let leftItem = IsABBST(node.left);
  let rightItem = IsABBST(node.right);

  if (leftItem.isBBST && rightItem.isBBST) {
    maxHeight = Math.max(leftItem.height, rightItem.height);
    factory = Math.abs(leftItem.height - rightItem.height);
  } else {
    return {
      isBBST: false
    }
  }

  return {
    height: maxHeight + 1,
    isBBST: factory <= 1
  }
};

```

#### 22.二叉树的深度

- 采用递归遍历的方式

```js
const Resolution = (root) => {
  if (root == null) {
    return 0;
  }
  
  let leftH = Resolution(root.left);
  let rightH = Resolution(root.right);
  
  return 1 + (leftH > rightH ? leftH : rightH);
};
```

#### 23.二叉树的第K大节点

- 使用右中左遍历方式

```js
const inTree = (root, k) => {
  if (root === null) {
    throw new Error('');
  }

  let targetNode = null;
  let count = 0;

  function travel(root) {
    if (root == null || targetNode != null) {
      return ;
    }

    travel(root.right);
    // 右中左进行遍历，所以先遍历完右边再添加
    count++;

    if (count === k) {
      targetNode = root;
    }
    
    travel(root.left)
  }

  travel(root);

  return targetNode.val;
};
```

#### 24.数组的第K大元素

- 使用快排的分治思想
- 注意划分的时候，内部循环需要判断左侧是否小于右侧

```
const inArray = (arr, k) => {
  if (arr === null || arr.length < k) {
    throw new Error('Array is not define or length is zero')
  }

  function partition(arr, left, right) {
    let key = arr[left];

    while (left < right) {
      while (left < right && arr[right] <= arr[left]) {
        right--;
      }

      arr[left] = arr[right];

      while (left < right && arr[left] >= arr[right]) {
        left++;
      }

      arr[right] = arr[left];
    }

    arr[left] = key;

    return left;
  }

  let resultMid = partition(arr, 0, arr.length - 1);
  let start = 0;
  let end = arr.length - 1;
  while (resultMid !== k - 1) {
    if (resultMid < k - 1) {
      start = resultMid + 1;
      resultMid = partition(arr, start, end);
    } else {
      end = resultMid - 1;
      resultMid = partition(arr, start, end);
    }
  }

  return arr[k - 1];
};

```

#### 25.找出数组中所有的逆序列

- 使用归并排序的思想，先拆分，然后组合的时候，只要右边有数字放到tempArray的时候，就增加数量，数量大小为 leftArray.length - i

```js
const Resolution = (arr) => {
  if (arr === null || arr.length === 0) {
    return [];
  }

  let count = 0;

  function split(arr, left, right) {

    if (left >= right) {
      return [arr[left]];
    }

    let mid = Math.floor((left + right) / 2);
    let tempArray = new Array(right - left + 1);

    let leftArr = split(arr, left, mid);
    let rightArr = split(arr, mid + 1, right);

    // 接下来是进行处理的过程
    let i = 0, j = 0, newIdx = 0;

    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        tempArray[newIdx++] = leftArr[i++];
      } else {
        tempArray[newIdx++] = rightArr[j++];
        count += leftArr.length - i;
      }
    }

    while (i < leftArr.length) {
      tempArray[newIdx++] = leftArr[i++];
    }

    while (j < rightArr.length) {
      tempArray[newIdx++] = rightArr[j++];
    }

    return tempArray;
  }

  split(arr, 0, arr.length - 1);

  return count;
};
```

#### 26.丑数

- 利用动态规划，大的数由小的数进行乘法然后得出，就可以保证只有2,3,5三个因数，并且需要由小到大，所以需要三个指针，都从0开始，每次求得最小值后，进行递增操作。

```js
const Resolution = (n) => {
  if (n <= 5) {
    return n;
  }

  let dp = new Array(n).fill(0);
  let p1 = 0, p2 = 0, p3 = 0;
  dp[0] = 1;

  for (let i = 1; i < n; i++) {
    dp[i] = Math.min(dp[p1] * 2, Math.min(dp[p2] * 3, dp[p3] * 5));

    if (dp[i] === dp[p1] * 2) p1++;
    if (dp[i] === dp[p2] * 3) p2++;
    if (dp[i] === dp[p3] * 5) p3++;
  }

  return dp[dp.length - 1];
};
```

#### 27.最长无重复子串

使用hashMap来进行记录每个字符的下标，然后通过计算得出最大值。

```js
  if (str === null || str.length === 0) {
    return '';
  }
    
  if (str.trim().length === 0) {
      return 1;
  }

  let idxContainer = new Map();
  let maxCount = 0;
  let count = 0;

  for (let i = 0; i < str.length; i++) {
    let pre = idxContainer.has(str[i]) ? idxContainer.get(str[i]) : -1;

    if (pre === -1 || i - pre > count) {
      count++;
    } else {
      maxCount = Math.max(count, maxCount);
      count = i - pre;
    }
    idxContainer.set(str[i], i);
  }

  return Math.max(count, maxCount);
```

#### 28.礼物的最大价值

- 采用动态规划方式

```js
const Resolution = (matrix) => {
  if (matrix === null || matrix.length === 0) {
    return -1;
  }

  let rowLen = matrix[0].length;
  let dp = new Array(rowLen).fill(0);

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < rowLen; j++) {
      if (j === 0) {
        dp[j] += matrix[i][j];
      } else {
        dp[j] = Math.max(dp[j], dp[j - 1]) + matrix[i][j];
      }
    }
  }

  return dp[dp.length - 1];
};

```

#### 29.把数字翻译成字符串

- 给定一个数字，我们按照如下规则把它翻译为字符串：0 翻译成 “a” ，1 翻译成 “b”，……，11 翻译成 “l”，……，25 翻译成 “z”。一个数字可能有多个翻译。请编程实现一个函数，用来计算一个数字有多少种不同的翻译方法。


```
const Resolution = (n) => {
  if (n < 0) {
    return -1;
  }

  if (n < 10) {
    return 1;
  }

  let str = n.toString();

  let dp = new Array(str.length).fill(0);
  dp[0] = 1;

  if (parseInt(str.slice(0, 2)) <= 25) {
    dp[1] = 2;
  } else {
    dp[1] = 1;
  }

  for (let i = 2; i < dp.length; i++) {
    dp[i] = dp[i - 1];

    if (str[i] !== '0' && parseInt(str.slice(i - 1, i + 1)) <= 25) {
      dp[i] += dp[i - 2];
    }
  }

  return dp[dp.length - 1];
};
```

#### 30.把数组排成最小的数

输入一个正整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最小的一个。

```js
const Resolution = (strArr) => {
  if (strArr === null) {
    return null;
  }

  strArr.sort((str1, str2) => {
    let newStr1 = str1 + str2;
    let newStr2 = str2 + str1;

    return newStr1 === newStr2 ? 0 : newStr1 > newStr2;
  });

  let result = '';

  strArr.forEach(item => {
    result += item;
  });

  return result;
};
```

#### 31.1 - n 中1出现的次数

#### 32. 数字序列中某个下标的数字

#### 33.数据流中的中位数

- 使用两个堆：大顶堆和小顶堆，然后首先先把数据放到大顶堆中，遇到偶数的时候，把大顶堆堆顶放到小顶堆中，这样循环即可。

#### 34.最小K个数据

- 使用容量为K的小顶堆即可。

#### 35.字符串的所有可能的排列

- 首先要进行全排列
  - 全排列要从小到大排起，每个数据都要从0开始到n-1，然后排到中间的时候需要进行标记某个数据是否已经被使用，所以需要有一个visited
- 然后去重

#### 36.树的序列化与反序列化

- 使用先序遍历序列化，模仿先序遍历反序列化

```js
const { BN1 } = require('./TestExample');

const BinaryNode = require('./datastruction/BinaryNode')

const process = (node, arr) => {
  if (node === null) {
    arr.push('#')
    return ;
  }

  arr.push(node.val);
  process(node.left, arr);
  process(node.right, arr);
};

const func = (node) => {
  let arr = []
  process(node, arr);
  return arr;
}

const build = (arr) => {
  if (arr.length === 0) {
    return null;
  }

  let idx = 0;

  function process(arr) {
    if (arr[idx] == '#') {
      idx++;
      return null;
    }

    let node = new BinaryNode(arr[idx++]);

    node.left = process(arr);
    node.right = process(arr);

    return node;
  }

  return process(arr);
}
console.log(func(BN1));
console.log(build(func(BN1)));
// console.log(BN1)

```

#### 37.二叉搜索树转为双向链表

- 注意的点是左边的节点的左侧链表为左子树的最大值
- 节点的右边节点是右子树的最小值

#### 38.复杂链表的复制

- 先在每个节点后面创建一个与它相同的节点
- 然后跳着来拆分链表。

#### 39.对称二叉树

- 不使用额外空间
- 使用两个指针的函数，然后分别从左右两侧进行递归遍历

```js
const Resolution = (node) => {
  if (node === null) {
    return true;
  }
  function process(p1, p2) {
    if (p1 === null && p2 === null) {
      return true;
    }

    if (p1 === null || p2 === null) {
      return false;
    }

    if (p1.val !== p2.val) {
      return false;
    }

    return process(p1.left, p2.right) && process(p1.right, p2.left);
  }

  return process(node.left, node.right);
};

```

#### 40.镜面复制二叉树

- 跟判断对称二叉树一致，但是要防止子树内部镜面

```js
const Resolution = (node) => {
  if (node === null) {
    return null;
  }

  function process(example, tar) {
    if (example.left !== null) {
      tar.right = new TreeNode(example.left.val);
      process(example.left, tar.right);
    }

    if (example.right !== null) {
      tar.left = new TreeNode(example.right.val);
      process(example.right, tar.left);
    }
  }

  let root = new TreeNode(node.val);

  process(node, root);

  return root;
};

```

#### 41.判断子树结构

- 递归遍历+相同树结构判断

```js
const Resolution = (sup, sub) => {
  if (sup === null && sub !== null) {
    return false;
  } else if (sub === null) {
    return true;
  }

  function travelTree(node) {
    if (node === null) {
      return false;
    }

    if (node.val === sub.val) {
      if (check(sub, node)) {
        return true;
      }
    }

    return travelTree(node.left) || travelTree(node.right);
  }

  function check(model, tar) {
    if (model === null) {
      return true;
    }

    if (model.val !== tar.val) {
      return false;
    }

    return check(model.left, tar.left) && check(model.right, tar.right);
  }

  return travelTree(sup);
};

```

#### 42.合并两个排序数组

- 使用递归和非递归
- 递归：找出当前两个链表的最小值，然后以最小值的下一个项和另外一个链表进行寻找最小值，然后当前最小值返回。
- 非递归：双指针法

#### 43.