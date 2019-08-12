/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
var ladderLength = function(beginWord, endWord, wordList) {
  if (beginWord.length == 1) {
    return wordList.length - 1;
  }

  let generateMap = {}, len = 1;
  
  // 进行建立通用表
  wordList.forEach((item) => {
    let temp = item
    for (let i = 0; i < item.length; i++) {
      item = temp.substring(0, i) + '*' + temp.substring(i + 1, temp.length)
      if (generateMap[item]) {
        generateMap[item].push(temp);
      } else {
        generateMap[item] = [temp];
      }
    }
  });

  // console.log(generateMap)

  // 使用hashMap来进行去重，使用两个数组来模拟分层，1数组负责遍历，而数组负责将下一层的值进行存储，然后两层交换的时候就会产生长度的增加
  let hashMap = {}
  let resultArr1 = [beginWord], resultArr2 = [];
  let arr1Len = resultArr1.length;

  for (let i = 0; i < arr1Len; i++) {
    let temp = resultArr1[i],
        item;
    
    if (!hashMap[temp]) {
      hashMap[temp] = true  // 标示

      for (let j = 0; j < temp.length; j++) {
        item = temp.substring(0, j) + '*' + temp.substring(j + 1, temp.length)
        
        let mapArr = generateMap[item]
  
        if (mapArr && mapArr.indexOf(endWord) != -1) {
          len++;
          return len;
        }
  
        if (mapArr && mapArr.length) {
          resultArr2.push(...mapArr)
        }
      }
    }

    if (i == arr1Len - 1) {
      // 说明即将换成下一层了，广度搜索这一层已经结束了
      len++;
      [resultArr2, resultArr1] = [resultArr1, resultArr2];
      arr1Len = resultArr1.length;
      resultArr2.length = 0;
      i = -1;
    }
  }
  return 0
};

console.log(ladderLength("hit",
"cog",
["hot","dot","dog","lot","log","cog"]))