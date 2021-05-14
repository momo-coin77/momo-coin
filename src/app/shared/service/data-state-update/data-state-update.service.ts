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
          this.userService.changeStatusUsingId(id)
          // this.userService.
        }
      }
      // console.log(data.val())
    })
  }
  addMaxUserDate(user:User):Promise<ResultStatut>
  {
    let date:Date=new Date();
    date.setDate(date.getDate()+5)
    return this.firebaseApi.set(`toupdate/account/${user.id.toString()}`,{dateMax:date.toISOString()})
  }
}
