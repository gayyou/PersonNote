# 斐波那契数列类型时间复杂度为logN解题方法

### 以斐波那契数列为例子讲解三种解题思路

动态规划的特征是后面的数据是由前面的数据推导出来的。想要得到后面的数据，必须通过求得前面的数据。如果题目中有了这种特征，那么基本上可以认为是动态规划类型的题目。

斐波那契数列的特征是第三个数字是由第一个数字+第二个数字组成的，所以我们可以得到递推式为：

`F(n) = F(n - 1) + F(n - 2)`，得到递推式我们的就可以进行解决动态规划问题。

##### 1.递归解决(2^N)

我们拿到递推式，最直观的方法就是使用递归来进行解决，话不多说，直接上代码吧！

```java
class Solution {
  public static resolve(int n) {
    if (n <= 2) {
      return 1;
    }
    
    return resolve(n - 1) + resolve(n - 2);
  }
}
```

时间复杂度最高，因为它是分裂式递归，并且递归过程中会重复执行多次求值，所以它的时间复杂度最高。2^n是因为它每次都是2倍增长，然后n个数的话，求到递归结束的条件的时候会是2^n。

##### 2.动态规划解决(N)

动态规划和递归是完全不同的两码事，动态规划的话是自底向上来进行的，先打好基础再求上层的值，这样就不会出现重复求值的情况。而递归是自顶向下来进行求值，很容易出现重复计算的情况，所以并不推荐。

思路：我们可以用一个变量a记住n - 2，一个变量b记住 n - 1，那么n就是a + b。

```java
class Solution {
  public static resolve(int n) {
    if (n <= 2) {
      return 1;
    }
    
    int pre = 1, mid = 1, post;
    
    while (n-- != 2) {
      post = pre + mid;
      mid = pre;
      pre = post;
    }
    
    return post;
  }
}
```

不用递归，空间复杂度是O(1)，时间复杂度为O(n)。比递归省空间省时间，多好。

##### 3.利用矩阵运算来降低动态规划的时间复杂度(logN)

利用矩阵的运算来降低时间复杂度，其实思路就是用动态规划解决。不过它的好处在于多次乘相同的矩阵，然后**矩阵的n次幂可以通过平方来降低计算的时间复杂度**。下面介绍如何实现。

1. 首先我们要建立一个1行2列矩阵，即A=(n, m)。然后我们的思路是将这个矩阵往右“位移”，**注意是算术位移而不是循环位移**。然后第一列换做n+m，即第二次情况是A=(n+m, n)这样。那么是怎么进行处理的呢？

2. 我们使用到矩阵运算，矩阵运算的规则是左边自行百度。

3. 问题的难点在于如何设计右边的矩阵，使得产生如上效果。我们将目标矩阵设为A，需要的矩阵设为B。我们可以发现A的第一个数永远是A的第一行和B的第一列进行计算，A的第二个数是A的第一行和B的第二列进行计算，所以我们可以设计出如下的矩阵：
   $$
   B = \left[
   \matrix{
   1 & 1\\
   1 & 0\\
   }
   \right]
   $$

所以我们可以得到如下的表达式：
$$
f(n) = （f(n - 1), f(n - 2)） * \left[
\matrix{
1 & 1\\
1 & 0\\
}
\right]
$$
递推回去的话，可以得出
$$
f(n) = （1, 1） * \left[
\matrix{
1 & 1\\
1 & 0\\
}
\right] ^ (n-2)
$$
那么我们可以做的就是将(n-2)次方进行简化，用多次平方的方法来进行简化运算，如10的75次方话，那么二进制是

`1001011`，那么我们只需要
$$
10^(64) * 10^8 * 10^2 * 10^1
$$
那么如何求出上面的数呢？我们通过10^1每次都进行乘方即可。

那么我们可以写出代码了：

```java
/**
 * @author Weybn
 * @motto Rare in the world you're worth it.
 * @time 2020/2/25 20:38
 */
public class Fiber {
  public static int getFiber(int n) {
    if (n <= 0) {
      return 0;
    }

    if (n <= 2) {
      return 1;
    }

    int[][] base = new int[][]{{1, 1}, {1, 0}};
    int[][] res = getFiberByMatrix(base, n - 2);
    return res[0][0] + res[1][0];
  }

  private static int[][] getFiberByMatrix(int[][] base, int n) {
    int[][] res = new int[base.length][base[0].length];

    for (int i = 0; i < res.length; i++) {
      res[i][i] = 1;
    }

    int[][] temp = base;

    for (; n != 0; n >>= 1) {
      if ((n & 1) != 0) {
        // 使用位运算
        res = matrixMutilate(res, temp);
      }
      temp = matrixMutilate(temp, temp);
    }

    return res;
  }

  private static int[][] matrixMutilate(int[][] a, int[][] b) {
    int[][] result = new int[a.length][b[0].length];

    for (int i = 0; i < result.length; i++) {
      for (int j = 0; j < result[0].length; j++) {
        for (int k = 0; k < result.length && k < result[0].length; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }

    return result;
  }
}
```

### 接下来是爬楼梯问题

题目：给定一个整数N，代表楼梯的个数，一次可以跨两步或者跨一步，那么有多少种解决的方式呢？

首先要确定递推式，这里就直接给出递推式，`f(n) = f(n - 1) + f(n - 2)`。解题思路跟斐波那契数列一致。

只不过初始值不一致而已。

### 母牛问题

问题：设母牛永远不会死，并且成熟后每年都可以生一头小母牛。小母牛生下来第三年可以生小牛。

如果使用矩阵来降低时间复杂度，怎么做呢？首先我们要知道递推式：

`f(n) = f(n - 1) + f(n - 3) `

那么要有一行三列，即`A=(i, j, k)`。更新后`(i + k, i, j)`，那么我们可以得出的三维矩阵为：
$$
B = \left[
\matrix{
1 & 1 & 0\\
0 & 0 & 1\\
1 & 0 & 0\\
}
\right]
$$
其余的思路跟上面一致。

### 总结

对于`f(n) = a * f(n - 1) + b * f(n - 2) + c * f(n - 3)...`类型的递推式的情况，我们都可以使用矩阵来降低动态规划时间复杂度。