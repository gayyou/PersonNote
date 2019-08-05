import { DaoInterface } from "../DaoInterface";
import { InteractionData } from '../../models/InteractionData';
import { CreateDataBaseConnect } from '../CreateDataBaseConnect';

export class UserDaoImpl implements DaoInterface {
  data: InteractionData;

  constructor(data: InteractionData) {
    this.data = data;
  }

  async insert(): Promise<Boolean> {
    let con = new CreateDataBaseConnect();
    await con.getCon(); // 连接数据库
    let strSql: string = 'INSERT INTO user (account, password) VALUES (?, ?);';
    let result: any = await con.querySqlStr(strSql, [this.data.account, this.data.password]);
    con.closeCon();
    if (result.affectedRows != 0) {
      return true;
    } else {
      return false;
    }
  }

  async delete(): Promise<void> {
    
  }
  
  async update(): Promise<void> {
    
  }

  async search(): Promise<void> {
    let con = new CreateDataBaseConnect();
    await con.getCon();  // 连接数据库
    let strSql: string = 'select * from user where account=? and password=?';
    let result: any = await con.querySqlStr(strSql, [this.data.account, this.data.password]);
    con.closeCon();
    return result;
  }
}