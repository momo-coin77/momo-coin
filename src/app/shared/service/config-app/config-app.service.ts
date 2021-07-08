import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Market, MarketState } from '../../entity/market';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { ResultStatut } from '../firebase/resultstatut';

@Injectable({
  providedIn: 'root'
})
export class ConfigAppService {
  market:BehaviorSubject<Market>=new BehaviorSubject<Market>(new Market());
  isForcedOpenMarketStatus:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  constructor(private firebaseApi:FirebaseApi,
    private router:Router) {
    this.firebaseApi.getFirebaseDatabase()
    .ref("config/market")
    .on("value",(data)=>{
      let market:Market=new Market();
      market.hydrate(data.val());
      this.market.next(market);
      this.isForcedOpenMarketStatus.next(market.state==MarketState.OPEN)
    })
  }

  checkBeforSave(market:Market):Promise<ResultStatut>
  {
    return new Promise<ResultStatut>((resolve,reject)=>{
      this.firebaseApi.fetchOnce("config/market/state")
      .then((result:ResultStatut)=>{
        if(result.result!=market.state) return this.saveMarket(market)
        return Promise.resolve(new ResultStatut())
      })
      .then((result:ResultStatut)=>resolve(result))
      .catch((error:ResultStatut)=>reject(error))
    })
  }

  saveMarket(market:Market):Promise<ResultStatut>
  {
    return new Promise<ResultStatut>((resolve,reject)=>{
      this.firebaseApi.set("config/market",market.toString())
      .then((result:ResultStatut)=>{
        // console.log("Result ",result)
        this.market.next(market);
        resolve(result)
      })
      .catch((error:ResultStatut)=>{
        this.firebaseApi.handleApiError(error);
        reject(error);
      })
    })
  }

  checkOpenTime()
  {
      let dateNow:Date=new Date();
      let isOpen=false;
      for(let time of this.market.getValue().openTime)
      {
        let startDate:Date=new Date();
        startDate.setHours(parseInt(time.start.split(':')[0]))
        startDate.setMinutes(parseInt(time.start.split(':')[1]))

        let endDate:Date=new Date();
        endDate.setHours(parseInt(time.end.split(':')[0]))
        endDate.setMinutes(parseInt(time.end.split(':')[1]))

        if(dateNow>=startDate && dateNow<=endDate) isOpen=true;
      } 
      return isOpen;
  }

  checkMarketTime()
  {
    let href = this.router.url;
    let tab = href.split('/');
    let isOpen = this.checkOpenTime();
    // console.log("isOpen ",isOpen)
    if(this.isForcedOpenMarketStatus.getValue()) return this.router.navigate(['market/open']);

    if (tab[1] === 'market') {

        if(isOpen && this.market.getValue().state==MarketState.CLOSE)
        {
          console.log("open")
          this.market.getValue().state=MarketState.OPEN;
          this.checkBeforSave(this.market.getValue())
          return this.router.navigate(['market/open']);
        }
        if(!isOpen && this.market.getValue().state==MarketState.OPEN)
        {
          this.market.getValue().state=MarketState.CLOSE;
          this.checkBeforSave(this.market.getValue())
          return this.router.navigate(['market/wait']);
        }
        if(isOpen) return this.router.navigate(['market/open']);
        else return this.router.navigate(['market/wait'])

    }
  }
  switchMarketState()  
  {
    return new Promise<ResultStatut>((resolve,reject)=>{
      let marketState:MarketState=this.market.getValue().state==MarketState.CLOSE?MarketState.OPEN:MarketState.CLOSE; 
      this.firebaseApi.updates([
        {
          link:"config/market/state",
          data:marketState
        }
      ])
      .then((result:ResultStatut)=>{
        this.market.getValue().state=marketState;
        resolve(result);
      })
      .catch((error:ResultStatut)=>{
        this.firebaseApi.handleApiError(error);
        reject(error);
      })
    })
  }
}
