/// 引入url处理模块
import * as url from "url";

export class Router {
  /**
   * 想要映射的路径的名字
   */
  controllerPath: string;
  
  /**
   * 构造器
   */
  constructor(controllerPath: string = './') {
    this.controllerPath = controllerPath;
  }
  
  /**
   * @description 将请求进行自然映射
   * @param req 请求对象
   * @param res 回复对象
   * @param json json对象
   */
  match(req: any, res: any, json: object): void {
    let pathname: any = url.parse(req.url).pathname;
    let paths: Array<string> = pathname.split('/');
    let controller: string = paths[1] || 'index';
    let action: string = paths[2] || 'index';
    let args: Array<string> = paths.splice(3);
    let modules: any;
    let str: string = '';
    try {
      // 引入controller层对应方法的js文件
      str = controller[0].toLocaleUpperCase() + controller.slice(1) + 'ControllerImpl';
      modules = require('./'+ this.controllerPath +'/impl/' + str);
      
    } catch (ex) {
      res.writeHead(404);
      res.end('回复结束');
      // 404错误
      return;
    }

    let contro = new modules[str](req, res, json);
    let method = contro[action];
    if (method) {
      method.call(contro, req, res);
    } else {
      // 404错误
    }
  }
}