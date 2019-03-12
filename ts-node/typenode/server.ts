import { Dispatch } from "./dispatch";
const http = require('http');
const Koa = require('koa');
const app = new Koa();

function start() {
  function onRequest(req: any, res: any) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization");
    res.setHeader("cache-control", "no-cache");
    res.setHeader("content-type", "application/json; charset=utf-8");
    console.log(req.method);
    let dispatch: Dispatch = new Dispatch(req, res);
    dispatch.dispathReq();
  }
  http.createServer(onRequest).listen(8080);
  console.log('服务器启动成功')
}

start();

// app.use((http: any) => {
//   let dispatch: Dispatch = new Dispatch(http.req, http.res);
//   dispatch.dispathReq();
// });

// app.listen(8080);