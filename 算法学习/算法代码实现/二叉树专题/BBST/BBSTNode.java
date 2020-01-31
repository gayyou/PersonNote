package binaryTree;

public class BBSTNode {
  public BBSTNode(int val) {
    this.val = val;
    this.bf = FactorEnums.EH;
  }
  int val;
  BBSTNode lc;
  BBSTNode rc;
  FactorEnums bf;
}
