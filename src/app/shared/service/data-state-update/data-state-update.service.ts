import { Injectable } from '@angular/core';
import { EntityID } from '../../entity/EntityID';
import { User } from '../../entity/user';
import { EventService } from '../event/event.service';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { ResultStatut } from '../firebase/resultstatut';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class DataStateUpdateService {

  constructor(
    private firebaseApi:FirebaseApi,
    private eventService:EventService,
    private userService:UserService
    ) { 
      // this.eventService.loginEvent.subscribe((user:User)=>{
        this.updateAccountMarket();
        this.updateAccountToBlocque();
      // })
    }

  async updateAccountMarket()
  {
    
  }

  async updateAccountToBlocque()
  {
    let requete:{link:string,data:any}[]=[];
    this.firebaseApi
    .getFirebaseDatabase()
    .ref("toupdate/account")
    .once("value",(data)=>{
      let kdata=data.val();
      for(let key in kdata)
      {
        let now=new Date();
        let after=new Date(kdata[key]);
        let id:EntityID=new EntityID();
        id.setId(key);
        if(after<now) 
        {
          this.deleteMaxUserDate(id);
          this.userService
          .getUserById(id)
          .then((result:ResultStatut)=>{
            
            if(result.result) this.userService.changeStatusUsingId(id)
          });
        }
      }
      // console.log(data.val())
    })
  }
  addMaxUserDate(id:EntityID):Promise<ResultStatut>
  {
    let date:Date=new Date();
    date.setDate(date.getDate()+5)
    return this.firebaseApi.set(`toupdate/account/${id.toString()}`,{dateMax:date.toISOString()})
  }

  deleteMaxUserDate(id:EntityID):Promise<ResultStatut>
  {
    return this.firebaseApi.delete(`toupdate/account/${id.toString()}`)
  }
}
