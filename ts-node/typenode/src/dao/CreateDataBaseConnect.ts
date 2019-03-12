import { DataBase } from '../config/ConnectDataBase';
const Connection = require('mysql');

export class CreateDataBaseConnect {
  con: any;

  constructor() {
    this.con = Connection.createConnection(DataBase.dataConfig);
  }
  /**
   * @author Weybn
   * @description 连接数据库并且得到数据库对象
   */
  async getCon(): Promise<object>  {
    return await new Promise((resolve: Function, reject: Function) => {
      this.con.connect((err: Error) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  }

  /**
   * @description 执行数据库语句
   * @param sqlStr mysql语句
   * @param args 参数
   * @param con 数据库操作对象
   */
  async querySqlStr(sqlStr: String, args: Array<String>) {
    return await new Promise((resolve: Function, reject: Function) => {
      this.con.query(sqlStr, args,(error: Error, result: any) => {
        if (error) {
          throw error;
        }
        if (result) {
          resolve(result);
        }
      });
    });
  }

  async closeCon() {
    // return await new Promise((resolve: Function, reject: Function) => {
    //   this.con.close((error: Error) => {
    //     if (error) {
    //       reject(error);
    //     }
    //     resolve(true);
    //   });
    // });
  }
}