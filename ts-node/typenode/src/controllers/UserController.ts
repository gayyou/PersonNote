import { InteractionData } from "../models/InteractionData";

export interface UserController {
  /**
   * @description 登陆
   */
  login(req: any, res: any, user: InteractionData): any;

  /**
   * @description 注册
   */
  register(req: any, res: any, user: InteractionData): any;
}