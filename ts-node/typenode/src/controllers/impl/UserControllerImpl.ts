import { UserController } from "../UserController";
import { InteractionData } from "../../models/InteractionData";
import { UserServiceImpl } from "../../service/impl/UserServiceImpl";
import { UserService } from "../../service/UserService";
import { ResponseData } from "../../dtos/ResponseData";

export class UserControllerImpl implements UserController {
  user: InteractionData;
  
  constructor(req: any = {}, res: any = {}, json: any = {}) {
    if (!json.email || !json.password) {
      res.writeHead(500);
      res.end('5005');
      // return;
    }
    let user: InteractionData = new InteractionData(json.email, json.password);
    let emailPattern = new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
    if (!emailPattern.test(user.account) || user.password.length > 18 || user.password.length < 6) {
      // 出错处理
      res.writeHead(500);
      res.end('5004');
      // return;
    }
    this.user = user;
  }

  async login(req: any, res: any) {
    let userService: UserService = new UserServiceImpl(this.user);
    let result = await userService.login();
    res.writeHead(200);
    res.end(JSON.stringify(result));
  }

  register(user: InteractionData) {
    
  }
}