import { InteractionData } from '../models/InteractionData';
import { ResponseData } from '../dtos/ResponseData';

export interface UserService {
  data: InteractionData;
  /**
   * @author Weybn
   * @description 登陆
   * @param data 用户对象
   */
  login(): any,

  /**
   * @description 注册
   * @param data 用户对象
   */
  register(): any;
}