import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EntityID } from '../../entity/EntityID';
import { Pack } from '../../entity/pack';
import { User } from '../../entity/user';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../event/event.service';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { ResultStatut } from '../firebase/resultstatut';

@Injectable({
  providedIn: 'root'
})
export class UserHistoryService {

  historyList:Pack[]=[];
  history:BehaviorSubject<Pack[]>=new BehaviorSubject<Pack[]>(this.historyList) 
  currentUser:User;

  constructor(
    private authService:AuthService,
    private eventService:EventService,
    private firebaseApi:FirebaseApi
    ) 
    {
      
      this.authService.currentUserSubject.subscribe((user:User)=>{
        this.currentUser=user;
        this.getPacksHistoryFromApi(this.authService.currentUserSubject.getValue());
      })
      //this.eventService.loginEvent.subscribe((user:User)=>{
      //    if(!user) return;
          
      //})  
      this.eventService.logoutEvent.subscribe((logout:boolean)=>{
        if(!logout) return;
        this.historyList=[];
        this.history.next(this.historyList)
      })
    }
    getUserPackHistory(idUser:EntityID)
    {
      return new Promise<ResultStatut>((resolve,reject)=>{
        this.firebaseApi.fetch(`history/${idUser.toString()}`)
        .then((result:ResultStatut)=> {
          //console.log("History ",result.result)
          let historyList=[];
          if(!result.result) reject(result)
          for(let key in result.result)
          {
            let pack=new Pack();
            pack.hydrate(result.result[key]);
            historyList.push(pack);
          }
          result.result=historyList
          resolve(result);
        })
        .catch((error)=>reject(error))
      })
    }
    getPacksHistoryFromApi(user:User)
    {
      //console.log(user)
        this.firebaseApi.fetch(`history/${user.id.toString()}`)
        .then((result:ResultStatut)=> {
          //console.log("History ",result.result)
          this.historyList=[];
          if(!result.result) return
          for(let key in result.result)
          {
            let pack=new Pack();
            pack.hydrate(result.result[key]);
            this.historyList.push(pack);
          }
          this.history.next(this.historyList)
        }) 
    }
    findPack(packId:EntityID):Promise<ResultStatut>
    {
        return new Promise<ResultStatut>((resolve,reject)=>{
          let pack=this.historyList.find((p:Pack)=>p.id.toString()==packId.toString())
          if(pack) {
              let result:ResultStatut=new ResultStatut();
              result.result=pack
              return resolve(result)
          }
          this.firebaseApi.fetchOnce(`history/${this.currentUser.id.toString()}/${packId.toString()}`)
          .then((result)=>{
              let pack=new Pack();
              pack.hydrate(result.result);
              result.result=pack;
              this.historyList.push(pack);
              resolve(result);
          })
          .catch((error)=>{
              this.firebaseApi.handleApiError(error);
              reject(error);
          })
        })        
    }
    addToHistory(pack:Pack):Promise<ResultStatut>
    {
      // console.log("Addhistor =y ", pack);
      return new Promise<ResultStatut>((resolve,reject)=>{
        this.firebaseApi.set(`history/${this.currentUser.id.toString()}/${pack.id.toString()}/`,pack.toString())
        .then((result:ResultStatut)=>{
          this.historyList.push(pack);
          this.history.next(this.historyList)
          resolve(result)
        })
        .catch((error)=>{
          this.firebaseApi.handleApiError(error);
          reject(error)
        })
      })
        
    }
  

}
