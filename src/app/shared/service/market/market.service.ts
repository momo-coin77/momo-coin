import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Pack, PackState } from '../../entity/pack';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../event/event.service';
import { FirebaseApi } from '../firebase/FirebaseApi';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  listPack: Map<String, Pack> = new Map<String, Pack>();
  packs: BehaviorSubject<Map<String, Pack>> = new BehaviorSubject<Map<String, Pack>>(this.listPack)
  constructor(
    private authService: AuthService,
    private eventService:EventService,
    private firebaseApi: FirebaseApi,
    private router: Router) {

    this.eventService.loginEvent.subscribe((user) => {
      // if (!user) return;
      //cette requete ne doit ce faire que si le marché est ouvert
      let ref = this.firebaseApi.getFirebaseDatabase()
        .ref('packs')        
        .limitToLast(200)
        .orderByChild("state")
        .equalTo(PackState.ON_MARKET)
        .on('child_added', (snapshot) => this.newPackFromMarket(snapshot))
        
    })
  }

  getOrderMarket()
  {
    return this.packs.pipe(
      map((p)=> Array.from(p.values())),
      map((pos: Pack[])=> pos.sort((a:Pack,b:Pack)=> a.amount<=b.amount?0:1))
    )
  }

  getMyOrderedPackOnMarket()
  {
    return this.packs.pipe(
      map((p)=> Array.from(p.values())),
      switchMap((p:Pack[])=> from(p)),
      filter((p:Pack)=> p.idOwner.toString()==this.authService.currentUserSubject.getValue().id.toString())
    )
  }
  getMyOrderdPackNotInMarket()
  {
    return this.packs.pipe(
      map((p)=> Array.from(p.values())),
      switchMap((p:Pack[])=> from(p)),
      filter((p:Pack)=> p.idOwner.toString()==this.authService.currentUserSubject.getValue().id.toString())
    )
  }

  newPackFromMarket(pack: any) {
    let pck: Pack = new Pack();
    console.log("data on market ",pack.val())
    pck.hydrate(pack.val());
    if (this.listPack.has(pck.id.toString())) { this.listPack.delete(pck.id.toString()); }
    
    this.listPack.set(pck.id.toString(), pck);
    this.packs.next(this.listPack);
  }

  getPackList() {
    return from(Array.from(this.packs.getValue().values()));
  }

  marketTime() {
    let href = this.router.url;
    let tab = href.split('/');
    let d = new Date();
    let hh = d.getHours();
    hh = hh;
    console.log(hh);
    if (tab[1] === 'market') {
      if (hh == 12 || hh == 11 || hh == 18 || hh == 19) {
        return this.router.navigate(['market/open']);
      } else {
        return this.router.navigate(['market/wait']);
      }
    };
  }

}
