import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EntityID } from '../../entity/EntityID';
import { Pack } from '../../entity/pack';
import { User } from '../../entity/user';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../event/event.service';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { ResultStatut } from '../firebase/resultstatut';
import { PlanService } from '../opperations/plan.service';

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
    private firebaseApi:FirebaseApi,
    private planService:PlanService
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
        this.firebaseApi.fetchOnce(`history/${idUser.toString()}`)
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
          result.result=historyList;
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
    addToHistory(pack:Pack,userID:EntityID=this.currentUser.id):Promise<ResultStatut>
    {
      // console.log("Addhistor =y ", pack);
      return new Promise<ResultStatut>((resolve,reject)=>{
        this.firebaseApi.set(`history/${userID.toString()}/${pack.id.toString()}/`,pack.toString())
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

    makeUniqueCoupleHistory(classEquiPack:Map<string,{first:Pack,second:Pack}[]>):{first:Pack,second:Pack}[]
  {
    let historySequence:{first:Pack,second:Pack}[]=[];
    for (const seq of Array.from(classEquiPack.values()))
    {
      console.log("Sequence ",seq);
      if(seq.length==1) historySequence.push(seq[0])
      else {
        //determiner le couple unique
      }
    }
    return historySequence;
  }
  makeEquivalenceClassPack(histories:Pack[]):Map<string,{first:Pack,second:Pack}[]>
  {
    let classEquiPack:Map<string,{first:Pack,second:Pack}[]>=new Map<string,{first:Pack,second:Pack}[]>()
    for(let i=0;i<histories.length;i++)
    {      
      for(let j=i+1;j<histories.length;j++)
      {
        let payDatei=new Date(histories[i].payDate).toLocaleDateString();
        let saleDatei=new Date(histories[i].saleDate).toLocaleDateString();
        let payDatej=new Date(histories[j].payDate).toLocaleDateString();
        let saleDatej=new Date(histories[j].saleDate).toLocaleDateString();

        if(
          saleDatej==payDatei && 
          histories[j].plan==histories[i].plan && 
          histories[i].amount==this.planService.calculePlan(histories[j].amount,histories[j].plan )
        )
        {
          if(
            (histories[j].idBuyer.toString()!="" && histories[j].idBuyer.toString()==histories[i].idOwner.toString()) ||
            (histories[j].idBuyer.toString()=="")            
            )
         {
          if(classEquiPack.has(saleDatej) ) classEquiPack.get(saleDatej).push({first:histories[j],second:histories[i]});
          else classEquiPack.set(saleDatej,[{first:histories[j],second:histories[i]}]);
         }
        }
        else if(
          saleDatei==payDatej && 
          histories[j].plan==histories[i].plan &&
          histories[j].amount==this.planService.calculePlan(histories[i].amount,histories[i].plan)
        )
        {
          if(
            (histories[i].idBuyer.toString()!="" && histories[i].idBuyer.toString()==histories[j].idOwner.toString()) ||
            (histories[i].idBuyer.toString()=="")            
            )
         {
          if(classEquiPack.has(saleDatei)) classEquiPack.get(saleDatei).push({first:histories[i],second:histories[j]});
          else classEquiPack.set(saleDatei,[{first:histories[i],second:histories[j]}]);
         }          
        }
      }
    }
    return classEquiPack;
  }

  getUsersWihtOutBuyerHistory():Promise<ResultStatut>
  {
    return new Promise<ResultStatut>((resolve,reject)=>{
      this.firebaseApi.fetchOnce("history")
      .then((result:ResultStatut)=>{
        let histories :Pack[]=[];
        let data= result.result;
        for(let idUser in data)
        {
          for(let idPack in data[idUser])
          {
            let pack:Pack=new Pack();
            pack.hydrate(data[idUser][idPack]);
            if(pack.idBuyer.toString()!="") histories.push(pack)
          }
        }
        // console.log("historique ",histories)
        result.result = histories;
        resolve(result);
      })
      .catch((error:ResultStatut)=>reject(error));
    })
  }  

}
