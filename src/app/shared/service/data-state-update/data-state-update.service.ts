import { Injectable } from '@angular/core';
import { EntityID } from '../../entity/EntityID';
import { Pack, PackBuyState } from '../../entity/pack';
import { User } from '../../entity/user';
import { EventService } from '../event/event.service';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { ResultStatut } from '../firebase/resultstatut';
import { BasicPackService } from '../pack/basic-pack.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class DataStateUpdateService {

  constructor(
    private firebaseApi: FirebaseApi,
    private eventService: EventService,
    private userService: UserService,
    private packService: BasicPackService
  ) {
    // this.eventService.loginEvent.subscribe((user:User)=>{
    this.updatePackMarket();
    this.updateAccountToBlocque();
    this.updatePackNotPaid();
    // console.log("Test update")
    // })
    this.eventService.registerNewUserEvent.subscribe((user:User)=>{
      if(!user) return;
      let date: Date = new Date();
      date.setDate(date.getDate() + 5)
      this.addMaxDateTo(`toupdate/account/${user.id.toString()}`,date)
    })

    this.eventService.addPackEvent.subscribe((pack:Pack)=>{
      if(!pack) return;
      let date: Date = new Date();
      date.setDate(date.getDate() + pack.plan);
      this.addMaxDateTo(`toupdate/pack/market/${pack.id.toString()}`,date)
    })

    this.eventService.shouldPaidPackEvent.subscribe((pack:Pack)=>{
      if(!pack) return;
      let date: Date = new Date();
      date.setHours(date.getHours() + 5)
      this.addMaxDateTo(`toupdate/pack/waittopaid/${pack.id.toString()}`,date)
    })

    this.eventService.packPaidEvent.subscribe((pack:Pack)=>{
      if(!pack) return;
      this.firebaseApi.delete(`toupdate/pack/waittopaid/${pack.id.toString()}`);
    })
  }

  async updatePackNotPaid()
  {
    this.findAndUpdate("toupdate/pack/waittopaid",(id:EntityID)=>{
      this.deleteToUpdate(`toupdate/pack/waittopaid/${id.toString()}`);
      this.packService
      .getPackById(id)
      .then((result:ResultStatut)=>{
        this.userService.changeStatusUsingId(result.result.idBuyer);

        this.firebaseApi.updates([
          {
            link:`packs/${id.toString()}/idBuyer`,
            data: ""
          },
          {
            link:`packs/${id.toString()}/buyState`,
            data: PackBuyState.ON_WAITING_BUYER
          },
          {
            link:`packs/${id.toString()}/plan`,
            data: 0
          },
          {
            link:`packs/${id.toString()}/waintedGain`,
            data: {
              jour:0,
              pourcent:0
            }
          }
        ]);
        
      })
    })
  }
  async updatePackMarket() {    
      this.findAndUpdate("toupdate/pack/market",(id:EntityID)=>
      {
          this.deleteToUpdate(`toupdate/pack/market/${id.toString()}`);
          this.packService.changePackStatus(id);
      })
  }

  async updateAccountToBlocque() {
    this.findAndUpdate("toupdate/account",(id:EntityID)=>
    {
      this.firebaseApi
        .getFirebaseDatabase()
        .ref("packs")
        .orderByChild("idOwner")
        .limitToLast(1)
        .equalTo(id.toString())
        .once("value", (dataPack) => {
          if (!dataPack.val()) {
            // console.log("Data ",dataPack)
            this.deleteToUpdate(`toupdate/account/${id.toString()}`);
            this.userService.changeStatusUsingId(id)
          }
          // else 
        })
      })
  }

  findAndUpdate(url:String,updateFnct:(key:EntityID)=>void)
  {
    this.firebaseApi
      .getFirebaseDatabase()
      .ref(url)
      .once("value", (data) => 
      {
        let kdata = data.val();
        // console.log("Data update",url,kdata)
        for (let key in kdata) 
        {
          let now = new Date();
          let after = new Date(kdata[key].dateMax);
          let id: EntityID = new EntityID();
          id.setId(key);
          if (after < now) {
            // console.log("Data update",kdata)
            updateFnct(id)
          }
        }
      });
  }
  addMaxDateTo(url:string,dateMax:Date):Promise<ResultStatut> 
  {
    return this.firebaseApi.set(url, { dateMax: dateMax.toISOString() })
  }

  deleteToUpdate(url:string): Promise<ResultStatut> {
    return this.firebaseApi.delete(url)
  }
}
