export class DataBase {
  static dataConfig: object = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'express_pro'
  }

  // get getDataConfig(): object {
  //   return this.getDataConfig;
  // }

  // /**
  //  * @author Weybn
  //  * @description 连接数据库并且得到数据库对象
  //  */
  // async getCon()  {
  //   await new Promise((resolve: Function, reject: Function) => {
  //     let con: Connection =  Connection.connect((err: Error) => {
  //       if (err) {
  //         throw err;
  //         // console.log(err);
  //         reject(err);
  //       }
  //       resolve(con);
  //     });
  //   });
  // }

  // async closeCon(con) {
  //   con.close();
  // }
}