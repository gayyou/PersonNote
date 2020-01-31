public class Solve {
  public void solve(char[][] board) {
    if (board.length == 0) return ;
    int traveLen = board.length;
    int verLen = board[0].length;
    boolean isFirst = true;

    for (int i = 0; i < traveLen; i++) {
      setTo2(board, 0, i);
      setTo2(board, verLen - 1, i);
    }

    for (int i = 0; i < verLen; i++) {
      setTo2(board, i, 0);
      setTo2(board, i, traveLen - 1);
    }

    for (int i = 0; i < traveLen; i++) {
      for (int j = 0; j < verLen; j++) {
        if (board[i][j] == '2') {
          board[i][j] = 'O';
        } else if (board[i][j] == 'O') {
          board[i][j] = 'X';
        }
      }
    }
  }

  private void setTo2(char[][] board, int t, int l) {
    int traveLen = board.length;
    int verLen = board[0].length;

    if (t >= verLen || t < 0 || l >= traveLen || l < 0 || board[l][t] == 'X' || board[l][t] == '2') {
      return ;
    }

    board[l][t] = '2';

    setTo2(board, t - 1, l);
    setTo2(board, t + 1, l);
    setTo2(board, t, l - 1);
    setTo2(board, t, l + 1);
  }


}
