import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Queue;

public class NumSquares {
  private class Node {
    int val;
    int step;

    public Node(int val, int step) {
      this.val = val;
      this.step = step;
    }
  }

  public int numSquares(int n) {
    if (n == 0) return 0;
    int max = (int) Math.floor(Math.pow((double) n, 0.5));
    Queue<Node> queue1 = new LinkedList<>();
    boolean record[] = new boolean[n];
    int num = 0;

    queue1.add(new Node(n, 0));

    while(!queue1.isEmpty()) {
      Node t = queue1.poll();
      int temp = t.val;
      int step = t.step;

      for (int i = 1; i <= max ; i++) {
        int nextVal = temp - i * i;
        if (nextVal == 0) {
          return step + 1;
        } else if (nextVal > 0 && !record[nextVal]) {
          queue1.add(new Node(nextVal, step + 1));
          record[nextVal] = true;
        }

        if (nextVal < 0) break;
      }
    }

    return -1;
  }

  public static void main(String[] args) {
    System.out.println(new NumSquares().numSquares(13));
  }
}
