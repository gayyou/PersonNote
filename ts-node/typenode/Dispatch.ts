import { Router } from './src/Router';
import { GetData } from './core/middleware/GetData';

export class Dispatch {
  req: any;
  res: any;
  
  constructor(req: any, res: any) {
    this.req = req;
    this.res = res;
  }

  async dispathReq() {
    let method: string = this.req.method.toLowerCase();
    
    switch(method) {
      case 'get': {

        break;
      }
      case 'post': {
        let getData = new GetData(this.req);
        let json = await getData.getBodyParam();
        let router = new Router('controllers');
        router.match(this.req, this.res, json);
        break;
      }
      case 'options': {
        this.res.writeHead(204);
        this.res.end();
        break;
      }
      default: {
        throw new Error('出现没法获得请求方式的错误');
      }
    }
  }
}