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
      this.firebaseApi.getFirebaseDatabase()
        .ref('packs')        
        .limitToLast(200)
        .on('value', (snapshot) => this.newPackFromMarket(snapshot))
      
      this.firebaseApi.getFirebaseDatabase()
      .ref('packs')
      .on('child_changed',(snapshot)=>this.updatePackFromMarket(snapshot))       

        // this.getMyOrderedPackOnMarket().subscribe((pack)=>console.log("Data in market ",pack))
    })
  }

  getOrderMarket()
  {
    return this.packs.pipe(
      switchMap((p)=> from(Array.from(p.values()))),
    );
  }
  getAllPackInMarket()
  {
    return this.getOrderMarket().pipe(
      filter((p:Pack)=> p.state==PackState.ON_MARKET),
    )
  }
  getOtherOrderedPackOnMarket()
  {
    return this.getOrderMarket().pipe(
      filter((p:Pack)=> p.idOwner.toString()!=this.authService.currentUserSubject.getValue().id.toString()),
      filter((p:Pack)=> p.state==PackState.ON_MARKET),
    )
  }

  getMyOrderedPackOnMarket()
  {
    return this.getOrderMarket().pipe(
      filter((p:Pack)=> p.idOwner.toString()==this.authService.currentUserSubject.getValue().id.toString()),
      filter((p:Pack)=> p.state==PackState.ON_MARKET)
    )
  }
  getMyOrderdPackNotInMarket()
  {
    return this.getOrderMarket().pipe(
      filter((p:Pack)=> p.idOwner.toString()==this.authService.currentUserSubject.getValue().id.toString()),
      filter((p:Pack)=> p.state==PackState.NOT_ON_MARKET)
    )
  }

  updatePackFromMarket(packs: any){
    // console.log("Upadated ",packs.val())
    let pack:Pack=new Pack();
    pack.hydrate(packs.val());

    this.listPack.set(pack.id.toString(),pack);
    this.packs.next(this.listPack);
  }
  newPackFromMarket(packs: any) {
    let packList:Pack[]=[];
    let oplist=packs.val();
    for(let pkey in oplist)
    {
      let pck: Pack = new Pack();
      pck.hydrate(oplist[pkey]); 
      packList.push(pck)     
    }
    packList.sort((a:Pack,b:Pack)=> a.amount>b.amount?0:1);

    packList.forEach((pack:Pack)=> {
      if (this.listPack.has(pack.id.toString())) return;
      this.listPack.set(pack.id.toString(), pack);
    })
    this.packs.next(this.listPack);
    // console.log("list pack ",this.listPack)
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
      if (hh == 16 || hh == 9 || hh == 8 || hh == 7) {
        return this.router.navigate(['market/open']);
      } else {
        return this.router.navigate(['market/wait']);
      }
    };
  }

}
