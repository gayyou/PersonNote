# 实现三角形

### CSS实现三角形

原理：css实现三角形的思路是利用边框在嵌合处是以矩形的斜边来嵌合的，把块状元素的内容的宽高都设为0，然后边框的厚度作为这个块状元素的厚度。并且把三条边设为透明的，就可以实现三角形。

```css
.trangle {
	width: 0;
  height: 0;
  border-width: 20px;
  border-color: transparent transparent transparent red;
}
```

这样就可以实现三角形的效果，不过这样实现的三角形是等腰三角形，如果想要是实现等边三角形呢？

我们首先来理解一下这个border-width是在哪里的宽度吧，我们看一下

```css
.triangle {
	border-left: 34.6px solid red; 
  border-top: 20px solid transparent; 
  border-right: 34.6px solid transparent;
  border-bottom: 20px solid transparent
}
```

