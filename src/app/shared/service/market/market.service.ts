import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from } from 'rxjs';
import { filter, map, reduce, scan, switchMap } from 'rxjs/operators';
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
        .on('child_added', (snapshot) => this.newPackFromMarket(snapshot))
        

        // this.getMyOrderedPackOnMarket().subscribe((pack)=>console.log("Data in market ",pack))
    })
  }

  getOrderMarket()
  {
    return this.packs.pipe(
      switchMap((p)=> from(Array.from(p.values()))),
      scan( (packList:Pack[],currPack:Pack)=> {
        packList.push(currPack)
        packList.sort((a:Pack,b:Pack)=> a.amount<=b.amount?0:1)
        console.log("arr ",packList)
        return packList;
      },[]),
    )
  }

  getMyOrderedPackOnMarket()
  {
    return this.getOrderMarket().pipe(
      switchMap((p:Pack[])=> from(p)),
      filter((p:Pack)=> p.idOwner.toString()==this.authService.currentUserSubject.getValue().id.toString()),
      filter((p:Pack)=> p.state==PackState.ON_MARKET),
      scan( (packList:Pack[],currPack:Pack)=> {
        packList.push(currPack)
        return packList;
      },[] )
    )
  }
  getMyOrderdPackNotInMarket()
  {
    return this.getOrderMarket().pipe(
      switchMap((p:Pack[])=> from(p)),
      filter((p:Pack)=> p.idOwner.toString()==this.authService.currentUserSubject.getValue().id.toString()),
      filter((p:Pack)=> p.state==PackState.NOT_ON_MARKET),
      scan( (packList:Pack[],currPack:Pack)=> {
        packList.push(currPack)
        return packList;
      },[] )
    )
  }

  newPackFromMarket(pack: any) {
    let pck: Pack = new Pack();
    // console.log("data on market ",pack.val())
    pck.hydrate(pack.val());
    if (this.listPack.has(pck.id.toString())) { this.listPack.delete(pck.id.toString()); }
    // console.log("comsqdf ",pck)
    this.listPack.set(pck.id.toString(), pck);
    console.log("paclmaket ",this.listPack)
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
      if (hh == 14 || hh == 15 || hh == 16 || hh == 17) {
        return this.router.navigate(['market/open']);
      } else {
        return this.router.navigate(['market/wait']);
      }
    };
  }

}
