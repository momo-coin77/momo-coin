import { Injectable } from '@angular/core';
import { EntityID } from '../../entity/EntityID';
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
    this.updateAccountMarket();
    this.updateAccountToBlocque();
    // })
    this.eventService.registerNewUser.subscribe((user:User)=>{
      if(!user) return;
      this.addMaxUserDate(user.id)
    })
  }

  async updateAccountMarket() {
    this.firebaseApi
      .getFirebaseDatabase()
      .ref('toupdate/account/market')
      .once('value', (data) => {
        let kdata = data.val();
        for (let key in kdata) {
          let id: EntityID = new EntityID();
          id.setId(key);
          let now = new Date();
          let after = new Date(kdata[key]);
          if (after <= now) {
            this.deleteMaxPackDate(id);
            this.packService.changePackStatus(id);
          }
        }
      })
  }

  async updateAccountToBlocque() {
    this.firebaseApi
      .getFirebaseDatabase()
      .ref("toupdate/account")
      .once("value", (data) => {
        let kdata = data.val();
        for (let key in kdata) {
          let now = new Date();
          let after = new Date(kdata[key]);
          let id: EntityID = new EntityID();
          id.setId(key);
          if (after < now) {
            this.firebaseApi
              .getFirebaseDatabase()
              .ref("packs")
              .orderByChild("idOwner")
              .limitToLast(1)
              .equalTo(kdata)
              .once("value", (dataPack) => {
                if (dataPack.val()) this.deleteMaxUserDate(id);
                else this.userService.changeStatusUsingId(id)
              })
          }
        }
      })
  }
  addMaxUserDate(id: EntityID): Promise<ResultStatut> {
    let date: Date = new Date();
    date.setDate(date.getDate() + 5)
    return this.firebaseApi.set(`toupdate/account/${id.toString()}`, { dateMax: date.toISOString() })
  }

  deleteMaxUserDate(id: EntityID): Promise<ResultStatut> {
    return this.firebaseApi.delete(`toupdate/account/${id.toString()}`)
  }
  deleteMaxPackDate(id: EntityID): Promise<ResultStatut> {
    return this.firebaseApi.delete(`toupdate/market/${id.toString()}`)
  }
}
