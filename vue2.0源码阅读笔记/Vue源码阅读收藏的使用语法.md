# Vue源码阅读收藏的使用语法

## 一、性能类型语法

### 缓存：

```ts
function creatCache(fn) {
  const cache = Object.create(null)
  return (function cachedFn (str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  })
}
```

