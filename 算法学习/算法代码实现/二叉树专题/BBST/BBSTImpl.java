package binaryTree;

import java.util.Stack;

public class BBSTImpl implements BTree {
  BBSTNode root;
  boolean isTaller;
  boolean isShoter;
  BBSTNode tempRoot;

  public BBSTImpl(int elem) {
    this.root = new BBSTNode(elem);
  }

  @Override
  public void rRotate(BBSTNode t) {
    BBSTNode temp = t.lc;
    t.lc = temp.rc;
    temp.rc = t;
    tempRoot = temp;
  }

  @Override
  public void lRotate(BBSTNode t) {
    BBSTNode temp = t.rc;
    t.rc = temp.lc;
    temp.lc = t;
    tempRoot = temp;
    System.out.println(temp.val);
  }

  @Override
  public void leftBalance(BBSTNode t) {
    BBSTNode lc = t.lc;
    switch (lc.bf) {
      case LH: {
        t.bf = lc.bf = FactorEnums.EH;
        rRotate(t.lc);
        break;
      }

      case RH: {
        BBSTNode rc = lc.rc;
        switch (rc.bf) {
          case LH: {
            t.bf = FactorEnums.RH;
            lc.bf = FactorEnums.EH;
            break;
          }

          case EH: {
            t.bf = lc.bf = FactorEnums.EH;
            break;
          }

          case RH: {
            t.bf = FactorEnums.EH;
            lc.bf = FactorEnums.LH;
            break;
          }
        }
        rc.bf = FactorEnums.EH;
        lRotate(lc);
        t.lc = tempRoot;
        rRotate(t);
        break;
      }
    }
  }

  @Override
  public void rightBalance(BBSTNode t) {
    BBSTNode rc = t.rc;
    switch (rc.bf) {
      case LH: {
        BBSTNode lc = rc.lc;
        switch (lc.bf) {
          case LH: {
            t.bf = FactorEnums.EH;
            rc.bf = FactorEnums.RH;
            break;
          }

          case EH: {
            t.bf = rc.bf = FactorEnums.EH;
            break;
          }

          case RH: {
            t.bf = FactorEnums.LH;
            rc.bf = FactorEnums.EH;
            break;
          }
        }
        lc.bf = FactorEnums.EH;
        rRotate(rc);
        t.rc = tempRoot;
        lRotate(t);
        break;
      }

      case RH: {
        t.bf = rc.bf = FactorEnums.EH;
        lRotate(t);
        break;
      }
    }
  }

  public Status insertAVL(int elem) {
    return this.insertAVL(this.root, elem);
  }

  @Override
  public Status insertAVL(BBSTNode t, int elem) {
    if (t == null) {
      tempRoot = new BBSTNode(elem);
      isTaller = true;
      return Status.SUCCESS;
    } else if (t.val == elem) {
      isTaller = false;
      return Status.FAIL;
    } else if (t.val > elem) {
      if (insertAVL(t.lc, elem) == Status.FAIL) {
        return Status.FAIL;
      }

      if (tempRoot != null) {
        t.lc = tempRoot;
        tempRoot = null;
      }

      if (isTaller) {
        switch(t.bf) {
          case LH: {
            leftBalance(t);
            isTaller = false;
            if (tempRoot != null && t == root) {
              this.root = tempRoot;
              tempRoot = null;
            }
            break;
          }

          case EH: {
            t.bf = FactorEnums.LH;
            isTaller = true;
            break;
          }

          case RH: {
            t.bf = FactorEnums.EH;
            isTaller = false;
            break;
          }
        }
      }
    } else {
      if (insertAVL(t.rc, elem) == Status.FAIL) {
        return Status.FAIL;
      }

      if (tempRoot != null) {
        // 是新增加的结点，那么rc指向是没有错误的。
        // 是旋转调用后，那么rc的指向也是没有错的，所以逻辑错误不在这
        t.rc = tempRoot;
        tempRoot = null;
      }

      if (isTaller) {
        switch (t.bf) {
          case LH: {
            t.bf = FactorEnums.EH;
            isTaller = false;
            break;
          }

          case EH: {
            t.bf = FactorEnums.RH;
            isTaller = true;
            break;
          }

          case RH: {
            rightBalance(t);
            isTaller = false;
            if (tempRoot != null && t == root) {
              this.root = tempRoot;
              tempRoot = null;
            }
            break;
          }
        }
      }
    }

    return Status.SUCCESS;
  }

  @Override
  public Status deleteAVL(BBSTNode t, int key) {
    // 思路和插入差不多，只是反过来，暂时不实现了
    return null;
  }

  @Override
  public BBSTNode searchNode(int key) {
    return null;
  }

  @Override
  public void destroyBBST() {
    this.root = null;
  }

  public BBSTNode getRoot() {
    return this.root;
  }

  @Override
  public void preTravel(BBSTNode t) {
    if (t == null) {
      return ;
    }
    preTravel(t.lc);
    System.out.println(t.val);
    preTravel(t.rc);
  }

  @Override
  public void postTravel(BBSTNode t) {
    if (t == null) {
      return ;
    }
    System.out.println(t.val);
    preTravel(t.lc);
    preTravel(t.rc);
  }

  @Override
  public void midTravel(BBSTNode t) {
    if (t == null) {
      return ;
    }
    preTravel(t.lc);
    preTravel(t.rc);
    System.out.println(t.val);
  }

  public static void main(String[] args) {

  }
}
