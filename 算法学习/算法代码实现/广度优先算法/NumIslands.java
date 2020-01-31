import java.lang.reflect.Array;
import java.util.ArrayDeque;
import java.util.ArrayDeque;

public class NumIslands {
  public int numIslands(char[][] grid) {
    ArrayDeque<int[]> stack = new ArrayDeque<>();
    int num = 0;

    for (int i = 0; i < grid.length; i++) {
      for (int j = 0; j < grid[i].length; j++) {
        if (grid[i][j] == '1') {
          num++;
          dfs(grid, i, j); // 重置为0，然后退出这个循环。
        }
      }
    }

    return num;
  }

  public void dfs(char[][] grid, int r, int c) {
    int nr = grid.length;
    int nc = grid[0].length;

    if (r < 0 || c < 0 || r >= nr || c >= nc || grid[r][c] == '0') {
      return ;
    }

    grid[r][c] = '0';
    dfs(grid, r - 1, c);
    dfs(grid, r + 1, c);
    dfs(grid, r, c - 1);
    dfs(grid, r, c + 1);
  }

  public static void main(String[] args) {
    char[][] arr = new char[1][2];
    arr[0] = new char[]{'1','0'};
    System.out.println(new NumIslands().numIslands(arr));
  }
}
