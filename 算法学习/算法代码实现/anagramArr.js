/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {
  let map = {}, resultArr = [];
  
  for (let i = 0; i < strs.length; i++) {
    let temp = strs[i].split('').sort().join();  // 排序
    if (map[temp]) {
      map[temp].push(strs[i]);
    } else {
      map[temp] = [strs[i]];
    }
  }

  for (let item in map) {
    resultArr.push(map[item]);
  }

  return resultArr;
};
console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]))