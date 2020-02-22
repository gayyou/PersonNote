# WebSocket与HTTP的区别

### HTTP

HTTP是一种无连接、无状态的应用层数据传输协议。由客户端主动对服务器发起请求，服务器通过对请求进行解析，然后获取信息返回给客户端。是建立在TCP连接之上的应用层协议。

### WebSocket

WebSocket是一种有连接的应用层协议，是建立在TCP上面的协议。它由HTTP请求进行升级而成。

- 由HTTP请求升级建立：Connection：upgrade
- 在TCP上面的协议
- 全双工服务器
- 开支小