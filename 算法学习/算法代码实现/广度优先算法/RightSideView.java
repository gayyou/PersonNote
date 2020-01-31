package reflect;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

/**
 * @author Weybn
 */
public class Solution {
  public List<Integer> rightSideView(TreeNode root) {
    if (root == null) return new LinkedList<Integer>();
    ArrayList<TreeNode> queue1 = new ArrayList<TreeNode>();
    ArrayList<TreeNode> queue2 = new ArrayList<TreeNode>();
    List<Integer> resultList = new LinkedList<Integer>();
    int index = 0;
    queue1.add(root);

    while(queue1.size() != 0) {
      TreeNode leftT = queue1.get(index).left;
      TreeNode rightT = queue1.get(index).right;

      if (index == queue1.size() - 1) {
        resultList.add(queue1.get(queue1.size() - 1).val);
      }

      if (leftT != null) {
        queue2.add(leftT);
      }

      if (rightT != null) {
        queue2.add(rightT);
      }

      index++;

      if (index == queue1.size()) {
        queue1 = queue2;
        queue2 = new ArrayList<TreeNode>();
        index = 0;
      }
    }

    return resultList;
  }
}

class TreeNode {
  int val;
  TreeNode left;
  TreeNode right;


  TreeNode(int x) { val = x; }
}