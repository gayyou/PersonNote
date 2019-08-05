/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function(root) {
  return isMirror(root, root)
};

const isMirror = function (t1, t2) {
  if (!t1 && !t2) return true;  // 如果同为空，说明对称
  if (!t1 || !t2) return false;  // 如果存在一个为空，那么说明不对称
  return t1.val === t2.val
        && isMirror(t1.left, t2.right)
        && isMirror(t1.right, t2.left);
}