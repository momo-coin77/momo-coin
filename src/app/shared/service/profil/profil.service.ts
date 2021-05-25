import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pack } from '../../entity/pack';
import { User } from '../../entity/user';
import { EventService } from '../event/event.service';
import { MarketService } from '../market/market.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  packForBalanceAccount:Map<string,boolean> = new Map<string,boolean>();

  balancedAccount:number = 0;
  balancedAccountObservable:BehaviorSubject<number>=new BehaviorSubject<number>(this.balancedAccount)

  constructor(
    private marketService:MarketService,
    private eventService:EventService
  ) {

    this.eventService.loginEvent.subscribe((user:User)=>{
      if(!user) return;
      this.balancedAccount+=user.bonus;
      this.balancedAccountObservable.next(this.balancedAccount);
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
}
