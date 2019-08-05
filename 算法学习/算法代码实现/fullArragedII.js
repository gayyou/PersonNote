// /**
//  * @param {number[]} nums
//  * @return {number[][]}
//  */
// var permuteUnique = function (nums) {
//   let resultArr = [];
//   nums = nums.sort((a, b) => a - b);
//   backTarp(0, nums.length, nums, resultArr);
//   return resultArr;
// };

// function backTarp(first, n, nums, resultArr) {
//   if (first == n) {
//     resultArr.push(nums.slice(0));
//     return;
//   }
//   let cacheMap = {}
//   for (let i = first; i < n; i++) {
//     swap(nums, first, i);
//     let temp = nums.slice(first + 1).sort((a, b) => a - b);
//     if (!cacheMap[temp]) {
//       cacheMap[temp] = true;
//       backTarp(first + 1, n, nums, resultArr);
//     }
//     swap(nums, first, i);
//   }
// }

// function swap(arr, f, s) {
//   let temp = arr[f];
//   arr[f] = arr[s];
//   arr[s] = temp;
// }

// 内存占用少，最快的解法
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function (nums) {
  let resultArr = [];
  nums = nums.sort((a, b) => a - b);
  backTarp(0, nums.length, nums, resultArr);
  let use = [];
  function backTarp(first, n, nums, resultArr) {
    if (first == n) {
      resultArr.push(nums.slice(0));
      return;
    }
    
    for (let i = first; i < n; i++) {
            
      swap(nums, first, i);
      backTarp(first + 1, n, nums, resultArr);
      swap(nums, first, i);
    }
  }
  return resultArr;
};

function swap(arr, f, s) {
  let temp = arr[f];
  arr[f] = arr[s];
  arr[s] = temp;
}

console.log(permuteUnique([1, 1, 1, 2, 2]))