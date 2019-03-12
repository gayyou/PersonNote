export class InteractionData {
  /**
   * 账号
   */
  account: string;
  /**
   * 密码
   */
  password: string;
  
  constructor(account: string, password: string) {
    this.account = account;
    this.password = password;
  }
}