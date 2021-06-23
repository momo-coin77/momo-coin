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
    getUserPackByIdBuyer(idBuyer:EntityID)
    {
      console.log("idBuer ",idBuyer.toString())
      return new Promise<ResultStatut>((resolve,reject)=>{
        this.firebaseApi.fetchOnce("history")
          .then((result)=>{
            // console.log("jlqsdjqqfsd")
            let rd=result.result;
            let rs:ResultStatut=new ResultStatut();
            rs.result=[];
            for(let idUser in rd)
            {
              for(let idPack in rd[idUser])
              {
                let pack:Pack=new Pack();
                pack.hydrate(rd[idUser][idPack]);
                if(pack.idBuyer.toString()==idBuyer.toString()) rs.result.push(pack);
              }              
            }
            console.log("Result buyer ",rs.result)
            resolve(rs);
          })
          .catch((error:ResultStatut)=>reject(error))
      })
    }
    getUserPackHistory(idUser:EntityID)
    {
      return new Promise<ResultStatut>((resolve,reject)=>{
        this.firebaseApi.fetchOnce(`history/${idUser.toString()}`)
        .then((result:ResultStatut)=> {
          // console.log("History ",result.result)
          let historyList=[];
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
  
  getUserPackSingleHistory(idUser:EntityID, idPack:EntityID):Promise<ResultStatut>
  {
    return new Promise<ResultStatut>((resolve,reject)=>{
      this.firebaseApi.fetchOnce(`history/${idUser.toString()}/${idPack.toString()}`)
      .then((result:ResultStatut)=>{
        let pack:Pack=new Pack();
        pack.hydrate(result.result);
        result.result=pack;
        resolve(result);
      })
      .catch((error:ResultStatut)=>reject(error))
      })
  }



  updateHistoryBuyer(link:{first:Pack,second:Pack}):Promise<ResultStatut>
  {
    return new Promise<ResultStatut>((resolve,reject)=>{
      if(link.first.idBuyer.toString().trim()=="")
      {
        console.log("link ",link);
        this.firebaseApi
        .updates([
          {
            link:`history/${link.first.idOwner.toString()}/${link.first.id.toString()}/idBuyer`,
            data:link.second.idOwner.toString()
          }
        ])
        .then((result:ResultStatut)=>resolve(result))
        .catch((error:ResultStatut)=>{
          console.log("Error ",error)
          this.firebaseApi.handleApiError(error);
          reject(error);
        })
        // resolve(new ResultStatut())
      }
    })
  }

  makeUniqueCoupleHistory(classEquiPack:Map<string,{first:Pack,second:Pack}[]>):Promise<ResultStatut>
  {
    return new Promise<ResultStatut>((resolve,reject)=>{
      let historySequence:{first:Pack,second:Pack}[]=[];
      let historyMap:Map<String,boolean>=new Map<String,boolean>()
      for (const seq of Array.from(classEquiPack.values()))
      {
        seq.forEach((couple)=>{
          if(!historyMap.has(`${couple.first.id.toString()}${couple.second.id.toString()}`)) 
          {
            historyMap.set(`${couple.first.id.toString()}${couple.second.id.toString()}`,true);
            historySequence.push(couple);
          }
        });
      }
      // console.log("historySequence ",historySequence)
      Promise.all(historySequence.map((couple:{first:Pack,second:Pack})=>this.updateHistoryBuyer(couple)))
      .then((result:ResultStatut[])=>resolve(new ResultStatut()))
      .catch((error:ResultStatut)=>reject(error))
    })
  }

  makeEquivalenceClassPack(histories:Pack[]):Map<string,{first:Pack,second:Pack}[]>
  {
    let classEquiPack:Map<string,{first:Pack,second:Pack}[]>=new Map<string,{first:Pack,second:Pack}[]>()
    // console.log("Historie equi ",histories)
    let md:Map<string,boolean>=new Map<string,boolean>();

    for(let i=0;i<histories.length;i++)
    { 
      for(let j=i+1;j<histories.length;j++)
      {
        let payDatei=new Date(histories[i].payDate).toLocaleDateString();
        let saleDatei=new Date(histories[i].saleDate).toLocaleDateString();
        let payDatej=new Date(histories[j].payDate).toLocaleDateString();
        let saleDatej=new Date(histories[j].saleDate).toLocaleDateString();
        // if(saleDatej==payDatei && histories[j].plan==histories[i].plan)  console.log(histories[i], histories[j])
        if(
          saleDatej==payDatei && 
          histories[i].idOwner.toString()!=histories[j].idOwner.toString() &&
          (histories[j].plan==histories[i].plan || histories[j].wantedGain.jour==histories[i].plan) && 
          (histories[i].amount==histories[j].nextAmount )
        )
        {
          if(histories[j].idBuyer.toString().trim()=="")
         {
          if(classEquiPack.has(saleDatej) ) classEquiPack.get(saleDatej).push({first:histories[j],second:histories[i]});
          else classEquiPack.set(saleDatej,[{first:histories[j],second:histories[i]}]);
         }
        }
        else if(
          saleDatei==payDatej && 
          histories[i].idOwner.toString()!=histories[j].idOwner.toString() &&
          (histories[j].plan==histories[i].plan || histories[i].wantedGain.jour==histories[j].plan) &&
            histories[j].amount==histories[i].nextAmount
        )
        {
          if(histories[i].idBuyer.toString().trim()=="")
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
            // if(pack.idBuyer.toString().trim()=="")
             histories.push(pack)
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
