export class ResultStatut 
{
  code:number;
  apiCode:any;
  result:any;
  message:string;
  description:string;
  static RESSOURCE_NOT_FOUND_ERROR=-1;
  static NETWORK_ERROR=-2;
  static UNKNOW_ERROR=-10;
  static INVALID_ARGUMENT_ERROR=-3;
  static SUCCESS=0;
  constructor(code=ResultStatut.SUCCESS,message="success",description='',result={}) {
    this.code=code;
    this.message=message;
    this.description=description;
    this.result=result;
   }
  
}
