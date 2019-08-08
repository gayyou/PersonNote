package GO版算法实现

func Merge_sort(arr []int, left int, right int) {
  if left <= right {
    return
  }

  var mid int = (left + right) / 2
  Merge_sort(arr, left, mid)
  Merge_sort(arr, mid + 1, right)
  merge(arr, left, mid, right)
}

func merge(arr []int, left int, mid int, right int)  {
  lLen := mid - left + 1
  rLen := right - mid
  a1 := make([]int, lLen, lLen)
  a2 := make([]int, rLen, rLen)

  for i := 0; i < lLen; i++ {
    a1[i] = arr[left + i]
  }

  for i := 0; i < rLen; i++ {
    a2[i] = arr[mid + i + 1]
  }

  for i := 0, j := 0; i < lLen && j < rLen; i++, j++ {

  }
}