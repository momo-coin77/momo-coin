import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pack } from '../../entity/pack';
import { User } from '../../entity/user';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../event/event.service';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { ResultStatut } from '../firebase/resultstatut';
import { MarketService } from '../market/market.service';
import { MembershipService } from '../opperations/Membership.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  fieulList:{user:User,nberPack:Number}[]=[];
  packForBalanceAccount:Map<string,boolean> = new Map<string,boolean>();

  balancedAccount:number = 0;
  balancedAccountObservable:BehaviorSubject<number>=new BehaviorSubject<number>(this.balancedAccount)

  constructor(
    private marketService:MarketService,
    private eventService:EventService,
    private authService:AuthService,
    private firebaseApi:FirebaseApi,
    private userService:UserService,
    private memberShipService:MembershipService
  ) {

    this.eventService.loginEvent.subscribe((user:User)=>{
      if(!user) return;
      this.balancedAccount+=user.bonus;
      this.balancedAccountObservable.next(this.balancedAccount);
    })

    this.eventService
    .newPackArrivedEvent
    .subscribe((arrived:boolean)=>{
      if(!arrived) return;
      this.balancedAccount=this.authService.currentUserSubject.getValue().bonus
    })

    this.marketService
    .getMyOrderedPack()
    .subscribe((pack:Pack)=>{
      if(!this.packForBalanceAccount.has(pack.toString().toString()))
      {
        this.balancedAccount+=pack.amount;
        this.packForBalanceAccount.set(pack.toString().toString(),true);
        this.balancedAccountObservable.next(this.balancedAccount);
      }
    })
   }
   
   addParentBonus(user:User,packAmount)
   {
    return new Promise<ResultStatut>((resolve,reject)=>{
      if(user.parentSponsorShipId.toString()!="") 
      {          
        this.userService.getUserBySponsorId(user.parentSponsorShipId)
        .then((result:ResultStatut)=>{
          result.result.bonus=this.memberShipService.membership(packAmount,result.result.bonus)

          return this.firebaseApi.updates([
                {
                    link:`users/${result.result.id.toString()}/bonus`,
                    data:result.result.bonus
                }
            ])
        })
        .then((result:ResultStatut)=>resolve(result))
        .catch((error:ResultStatut)=> resolve(new ResultStatut))                   
      }
      else resolve(new ResultStatut())
    }) 
   }

   getFieulList():Promise<ResultStatut>
   {
     return new Promise<ResultStatut>((resolve,reject)=>{
      let resultStatut:ResultStatut = new ResultStatut()
      // if(this.fieulList.length>0) {
      //   resultStatut.result = this.fieulList.slice();
      //   return resolve(resultStatut)
      // }
      this.fieulList=[];
      this.firebaseApi
      .getFirebaseDatabase()
      .ref("users")
      .orderByChild("parentSponsorShipId")
      .equalTo(this.authService.currentUserSubject.getValue().mySponsorShipId.toString())
      .once("value",(result)=>{
        let data = result.val();
        for(let k in data)
        {
          let user:User = new User();         
          user.hydrate(data[k]);     
          user.dateCreation=(new Date(user.dateCreation)).toLocaleDateString();     
          this.fieulList.push({user,nberPack:this.marketService.getNumberOfPack(user.id)});
        }
        resultStatut.result = this.fieulList.slice();
        return resolve(resultStatut)
      })
     })
   }
}
