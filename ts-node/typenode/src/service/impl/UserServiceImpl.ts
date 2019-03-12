import { UserService } from '../UserService';
import { InteractionData } from '../../models/InteractionData';
import { ResponseData } from '../../dtos/ResponseData';
import { DaoInterface } from '../../dao/DaoInterface';
import { UserDaoImpl } from '../../dao/impl/UserDaoImpl';
import { ResponseDataImpl } from '../../dtos/impl/ResponseDataImpl';

export class UserServiceImpl implements UserService {
  data: InteractionData;

  constructor(data: InteractionData) {
    this.data = data;
  }

  async login(): Promise<ResponseData> {
    let userDao: DaoInterface = new UserDaoImpl(this.data);
    let result: any = await userDao.search();
    let resData: ResponseData = new ResponseDataImpl();
    if (result.length == 0) {
      resData.status = '2002';
    } else {
      resData.status = '2001';
    }
    return resData;
  }

  async register() {

  }
}