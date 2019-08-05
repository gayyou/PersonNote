/**
 * @description 这个解法的思路是对指数进行简化处理，减少循环的次数。处理的方式是用二进制来进行表示指数。如 8 = 2 * 2 * 2，也就是0111，然后进行递归求解
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
var myPow = function(x, n) {
  if (n === 1) {
    return x;
  }

  if (n === 0) {
    return 1;
  }

  if (n === -1) {
    return (1 / x);
  }

  let halfN = Math.floor(n / 2);
  const res = myPow(x, halfN);

  if (n % 2 === 0) {
    // 当 n % 2 为0的时候，需要进行 * 2操作，因为这个算法的思路是将指数用2进制来表示。如果余2为0的话,则不需要多乘一个x
    return res * res;
  } else {
    return res * x * res;
  }
};

console.log(myPow(2.00000, 28))