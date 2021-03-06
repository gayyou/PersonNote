# JSON Web Token

[TOC]

### Session

由于HTTP是无状态的应用层协议，所以每次进行http请求的时候，是不能够保存上次的登陆状态，所以需要有一种机制来进行记住登陆状态。传统的话是在服务端采用session的方式来进行记住登陆状态，不过这种登陆状态有以下弊端：

- 服务端需要使用内存来保持登陆状态，过多的用户状态信息会导致服务器消耗过多内存
- 同源策略的限制，如果跨域时候不进行处理的话，cookie是不会携带信息过去。

### Token

使用Token的话，服务端是不会保持任何的登陆信息，反而是由浏览器使用本地存储能力来进行保存信息。（Storage或者Cookie存储）。然后在请求头添加字段进行判断登陆信息。

Token有三部分组成的：

##### 1.Header

- 声明类型
- 加密算法

##### 2.Payload

- 需要保持的参数内容
  - 维持登陆时间
  - 签发时间
  - token id等等

##### 3.Signature

- 加密后的结果，也就是最后会给客户端的内容，包含的内容有
  - Header
  - Payload
  - Secret：私钥
- 在处理的时候，将Header和Payload通过base64加密后，然后使用加密算法，以secret为秘钥进行加密。然后登陆状态成功后返回给前端进行保存。



流程如下：

1. 客户端进行登陆请求
2. 服务端处理完业务后，将登陆信息等通过jwt来进行处理，然后得到token发回前端
3. 前端拿到token，进行本地存储，然后每次请求的时候携带字段到后端
4. 后端进行解密，然后解析判断是否登陆

所以存储压力放到前端。