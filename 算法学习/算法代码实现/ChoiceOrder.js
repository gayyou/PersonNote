const ChoiceOrder = (arr) => {
  let len = arr.length, min, k;

  for (let i = 0; i < len; i++) {
    k = i;

    for (let j = i + 1; j < len; j++) {
      if (arr[k] > arr[j]) {
        k = j
      }
    }

    if (k != i) {
      [arr[k], arr[i]] = [arr[i], arr[k]];
    }
  }
}

let arr = [1, 3, 2, 5, 2, 5, 2, 1, 1, 1, 1, 2, 8, 11];
ChoiceOrder(arr);
console.log(arr);