import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Market, MarketState } from '../../entity/market';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { ResultStatut } from '../firebase/resultstatut';

@Injectable({
  providedIn: 'root'
})
export class ConfigAppService {
  market:BehaviorSubject<Market>=new BehaviorSubject<Market>(new Market());

  constructor(private firebaseApi:FirebaseApi) {
    this.firebaseApi.getFirebaseDatabase()
    .ref("config/market")
    .on("value",(data)=>{
      let market:Market=new Market();
      market.hydrate(data.val());
      this.market.next(market);
    })
  }

  saveMarket(market:Market):Promise<ResultStatut>
  {
    return new Promise<ResultStatut>((resolve,reject)=>{
      this.firebaseApi.set("config/market",market.toString())
      .then((result:ResultStatut)=>{
        this.market.next(market);
        resolve(result)
      })
      .catch((error:ResultStatut)=>{
        this.firebaseApi.handleApiError(error);
        reject(error);
      })
    })
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
