import * as url from "url";

export class GetData {
  /**
   * @description 请求参数
   */
  req: any;
  
  constructor(req: any) {
    this.req = req;
  }

  /**
   * @description 得到url的参数
   */
  get getUrlParam(): object {
    return url.parse(this.req.url, true);
  }

  /**
   * @description 得到报文体的参数
   * @version 1.0.0
   */
  async getBodyParam() {
    return await new Promise((resolve: Function, reject: Function) => {
      let str: string = '';
      let json: object;
      this.req.on('data', (chunk: string) => {
        str += chunk;
      });
      this.req.on('end', () => {
        console.log(str);
        json = JSON.parse(str);
        resolve(json);
      });
    });
  }
}