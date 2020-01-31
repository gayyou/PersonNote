package binaryTree;

public interface BTree {
  void rRotate(BBSTNode t);
  void lRotate(BBSTNode t);
  void leftBalance(BBSTNode t);
  void rightBalance(BBSTNode t);
  Status insertAVL(BBSTNode t, int elem);
  Status deleteAVL(BBSTNode t, int key);
  BBSTNode searchNode(int key);
  void destroyBBST();
  void preTravel(BBSTNode root);
  void postTravel(BBSTNode root);
  void midTravel(BBSTNode root);
}
