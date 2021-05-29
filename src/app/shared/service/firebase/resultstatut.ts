import { Entity } from "../../entity/entity";


export class ResultStatut extends Entity {
  code: number;
  apiCode: any;
  result: any;
  message: string;
  description: string;
  // tslint:disable-next-line:member-ordering
  static RESSOURCE_NOT_FOUND_ERROR = -1;
  static NETWORK_ERROR = -2;
  static UNKNOW_ERROR = -10;
  static INVALID_ARGUMENT_ERROR = -3;
  static SUCCESS = 0;
  constructor(code = ResultStatut.SUCCESS, message = 'success', description = '', result = null) {
    super()
    this.code = code;
    this.message = message;
    this.description = description;
    this.result = result;
  }
  hydrate(entity)
  {
    super.hydrate(entity)
  }
  toString()
  {
    return {
      code:this.code,
      apiCode:this.apiCode,
      message:this.message,
      description:this.description,
      result:this.result,      
    }
  }

}
