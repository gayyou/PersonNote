class Sort {
  swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  // quickSort的比较的普通解法
  partition1(arr, l, r) {
    let key = arr[l];
    while(l < r) {
      while (l < r && arr[r] >= key) {
        r--;
      }

      arr[l] = arr[r];

      while (l < r && arr[l] <= key) {
        l++;
      }

      arr[r] = arr[l];
    }
    arr[l] = key;

    return l;
  }

  partition2(arr, left, right) {
    let key = arr[right];   // 拿最高的那一位作为哨兵
    let current = 0;    // 这是比哨兵小的数字的个数，也是这个数组中，在这个current的左边比哨兵小

    // 这个循环中，只要有数字比key小的，那么就挪到左边
    for (; left < right; left++) {
      if (arr[left] < key) {
        this.swap(arr, current, arr[left]);
        current++;
      }
    }
    this.swap(arr, current, arr[right]);
    return current;   // 返回边界值，在这个边界值中，左边比哨兵小，右边比哨兵大
  }

  quickSort(arr, left, right) {
    if (left >= right) {
      return ;
    }
    let mid = this.partition1(arr, left, right);
    this.quickSort(arr, left, mid - 1);
    this.quickSort(arr, mid + 1, right);
  }



  bubbleSort(arr) {
    let isSwaped = false;

    for (let i = 0; i < arr.length - 1; i++) {
      isSwaped = false;
      for (let j = 0; j < arr.length - i; j++) {
        if (arr[j] > arr[j + 1]) {
          this.swap(arr, j, j + 1);
          isSwaped = true;
        }
      }

      if (!isSwaped) {
        break;
      }
    }
  }

  insertSort(arr) {
    for (let i = 0; i < arr.length; i++) {
      let temp = arr[i];

      let j = i - 1;

      while (j >= 0 && temp < arr[j]) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = temp;
    }
  }
}


let sort = new Sort();
let arr = [-3, -1, 100, 2, 1, -1, 2, -3, 4];
sort.insertSort(arr);
console.log(arr);
