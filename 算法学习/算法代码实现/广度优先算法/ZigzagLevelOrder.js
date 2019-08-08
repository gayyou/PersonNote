/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
// 本题思路跟LevelOrder相似，只是需要判断是否需要逆序读取，需要逆序读取的时候
var zigzagLevelOrder = function(root) {
  let queue1 = [], queue2 = [], resultArr = [], isReverse = false, valArr;
  
  if (!root) return resultArr;  // 判空，返回空数组

  queue1.push(root);  // 初始化的时候先将根节点挪进去
  
  while(queue1.length) {
    if (isReverse) {
      valArr = reverseIter(queue1, queue2);
    } else {
      valArr = orderIter(queue1, queue2);  // 进行层次遍历
    }
    

    if (valArr.length) {
      resultArr.push(valArr);
    }

    [queue1, queue2] = [queue2, queue1];  // 交换队列指向位置
    queue2.length = 0;  // 初始化队列2

    isReverse = !isReverse;
  }
  
  
  return resultArr;
};

const orderIter = (queue, childQueue) => {
  let len = queue.length, valArr = [];
  for (let i = 0; i < len; i++) {
    valArr.push(queue[i].val);  // 将值装进数组
    if (queue[i].left) {
      childQueue.push(queue[i].left)
    }

    if (queue[i].right) {
      childQueue.push(queue[i].right)
    }
  }

  return valArr;
}

const reverseIter = (queue, childQueue) => {
  let len = queue.length, valArr = [];
  while(len--) {
    valArr.push(queue[len].val);  // 将值装进数组
    if (queue[len].right) {
      childQueue.unshift(queue[len].right)
    }
    
    if (queue[len].left) {
      childQueue.unshift(queue[len].left)
    }
  }

  return valArr;
}
function createNode(val) {
  return {
    val,
    left: null,
    right: null
  }
}

function createTree() {
  let root = createNode(1);
  let t1 = root.left = createNode(2);
  let t2 = root.right = createNode(3);
  let t3 = t1.left = createNode(4);
  let t4 = t1.right = createNode(5);
  let t5 = t2.left = createNode(6);
  let t6 = t2.right = createNode(7);
  t3.left = createNode(8);
  t3.right = createNode(9);
  t4.left = createNode(10);
  t4.right = createNode(11);
  t5.left = createNode(12);
  t5.right = createNode(13);
  t6.left = createNode(14);
  t6.right = createNode(15);
  return root;
}

let root = createTree();

let arr = zigzagLevelOrder(root);
console.log(arr)