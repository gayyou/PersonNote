import { ResponseData } from "../ResponseData";

export class ResponseDataImpl implements ResponseData {
  status: string;  
  data: object;

  constructor(status: string = '', data: object = {}) {
    this.status = status;
    this.data = data;
  }

  set setStatus(status: string) {
    this.status = status;
  }

  set setData(data: object) {
    this.data = data;
  }
}