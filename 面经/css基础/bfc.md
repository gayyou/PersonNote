# 什么是BFC

BFC即块级格式上下文。每个块级格式上下文相当于一个容器，不会让里面的元素来影响到外面的元素。主要有两方面的作用：1.消除浮动产生的坍塌问题，2.容器内部元素的外边距影响到容器的外边距。

如何产生BFC？

1. display为flex、inner-block、table、flow-root
2. overflow为hidden
3. float不为none
4. html根元素
5. position为absolute、fixed