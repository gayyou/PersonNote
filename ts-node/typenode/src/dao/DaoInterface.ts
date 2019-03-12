import { InteractionData } from "../models/InteractionData";

export interface DaoInterface {
  /**
   * 查询的数据，这个数据存放在构造器上
   */
  data: any;

  /**
   * 插入
   */
  insert(): Promise<Boolean>;
  
  /**
   * 查询
   */
  search(): Promise<void>;

  /**
   * 更新
   */
  update(): Promise<void>;

  /**
   * 删除
   */
  delete(): Promise<void>;
}