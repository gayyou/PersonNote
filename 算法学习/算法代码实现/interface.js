/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
// 层序遍历
// 根节点的指向
const LevelOrder = (root) => {

}

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
// 齿锯层序遍历
// 根节点的指向
const zigzagLevelOrder = (root) => {

}

/**
 * @description 快速排序
 * @param {Array<Number>} arr 
 */
const quickSort = (arr, left, right) => {
  if (left >= right) {
    return ;
  }

  let i = left, j = right, temp = arr[left];

  while(i < j) {
    while(i < j && temp <= arr[j]) {
      j--;
    }

    arr[i] = arr[j];

    while(i < j && temp >= arr[i]) {
      i++;
    }

    arr[j] = arr[i];
  }

  arr[i] = temp;
  quickSort(arr, left, i - 1);
  quickSort(arr, j + 1, right);
}
let arr = [2, 3, 4, 2, 1, 4, 11, 111, 2, 2, 1, 1]
quickSort(arr, 0, arr.length - 1);


/**
 * 
 * @param {Array<Number>} arr 
 */
const MergeSort = (arr) => {

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