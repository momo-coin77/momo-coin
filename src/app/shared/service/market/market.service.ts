import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from } from 'rxjs';
import { filter, map, reduce, scan, switchMap } from 'rxjs/operators';
import { EntityID } from '../../entity/EntityID';
import { Pack, PackState } from '../../entity/pack';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../event/event.service';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { ResultStatut } from '../firebase/resultstatut';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  listPack: Map<String, Pack> = new Map<String, Pack>();
  packs: BehaviorSubject<Map<String, Pack>> = new BehaviorSubject<Map<String, Pack>>(this.listPack)
  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private firebaseApi: FirebaseApi,
    private router: Router) {
      // this.putAllNoToMarket();
    // this.eventService.loginEvent.subscribe((user) => {
    //   if (!user) return;
      //cette requete ne doit ce faire que si le marché est ouvert
      this.firebaseApi.getFirebaseDatabase()
        .ref('packs')
        .on('value', (snapshot) => this.newPackFromMarket(snapshot)),
        this.firebaseApi.getFirebaseDatabase()
          .ref('packs')
          .on('child_changed', (snapshot) => this.updatePackFromMarket(snapshot));

      // this.getMyOrderedPackOnMarket().subscribe((pack)=>console.log("Data in market ",pack))
    // });
  }

  putAllNoToMarket()
  {
    return new Promise<ResultStatut>((resolve,reject)=>{
      this.firebaseApi.getFirebaseDatabase()
        .ref('packs')
        .once('value', (packs) =>{
          let packListTack: Promise<ResultStatut>[] = [];
          let oplist = packs.val();
          for (let pkey in oplist) {
            let pck: Pack = new Pack();
            pck.hydrate(oplist[pkey]);
            pck.state=PackState.NOT_ON_MARKET;
            packListTack.push(this.firebaseApi.updates([{
              link:`packs/${pck.id.toString()}/state`,
              data:PackState.NOT_ON_MARKET
            }]));            
          }
          Promise.all(packListTack)
          .then((result)=>resolve(new ResultStatut()))
          .catch((error:ResultStatut)=>reject(error))         
        });
    })
  }

  getNumberOfPack(idUser:EntityID):Number
  {
    let nbpack = 0;
    for(let pack of Array.from(this.listPack.values()))
    {
      console.log(pack.idOwner.toString(),idUser.toString())
      if(pack.idOwner.toString()==idUser.toString()) nbpack++;
    }
    return nbpack;
  }

  getOrderMarket() {
    return this.packs.pipe(
      switchMap((p) => from(Array.from(p.values()))),
    );
  }

  getMyOrderedPack(idOwner:EntityID = this.authService.currentUserSubject.getValue().id)
  {
    return this.getOrderMarket().pipe(
      filter((p: Pack) =>  {
        return p.idOwner.toString() == idOwner.toString()
      }),
    )
  }
  getUserOrderedPack(idOwner:EntityID)
  {
    return this.getMyOrderedPack(idOwner);
  }

  getAllPackInMarket() {
    return this.getOrderMarket().pipe(
      filter((p: Pack) => p.state == PackState.ON_MARKET),
    )
  }
  getOtherOrderedPackOnMarket() {
    return this.getAllPackInMarket().pipe(
      filter((p: Pack) => p.idOwner.toString() != this.authService.currentUserSubject.getValue().id.toString())
    )
  }

  getMyOrderedPackOnMarket(idOwner:EntityID= this.authService.currentUserSubject.getValue().id) {
    return this.getAllPackInMarket().pipe(
      filter((p: Pack) => p.idOwner.toString()== idOwner.toString()),
    )
  }

  getUserOrderedPackOnMarket(idOwner:EntityID)
  {
    return this.getMyOrderedPackOnMarket(idOwner);
  }
  getAllPackNotInMarket()
  {
    return this.getOrderMarket().pipe(
      filter((p: Pack) => p.state == PackState.NOT_ON_MARKET)
    )
  }
  getMyOrderdPackNotInMarket(idOwner:EntityID=this.authService.currentUserSubject.getValue().id) {
    return this.getOrderMarket().pipe(
      filter((p: Pack) => p.idOwner.toString() == idOwner.toString()),
      filter((p: Pack) => p.state == PackState.NOT_ON_MARKET)
    )
  }
  getUserOrderdPackNotInMarket(idOwner:EntityID)
  {
    return this.getMyOrderdPackNotInMarket(idOwner);
  }

  updatePackFromMarket(packs: any) {
    let pack: Pack = new Pack();
    pack.hydrate(packs.val());
    if(this.listPack.has(pack.id.toString())) this.listPack.delete(pack.id.toString());
    this.listPack.set(pack.id.toString(), pack);
    this.eventService.newPackArrivedEvent.next(true);
    this.packs.next(this.listPack);
    this.eventService.syncFamilyEvent.next(true);
  }

  newPackFromMarket(packs: any) {
    let packList: Pack[] = [];
    let oplist = packs.val();
    for (let pkey in oplist) {
      let pck: Pack = new Pack();
      pck.hydrate(oplist[pkey]);
      packList.push(pck);
    }

    packList.sort((a: Pack, b: Pack) => a.amount > b.amount ? 0 : 1);

    packList.forEach((pack: Pack) => {
      if (this.listPack.has(pack.id.toString())) { return; }
      this.listPack.set(pack.id.toString(), pack);
    });
    this.eventService.newPackArrivedEvent.next(true);
    this.packs.next(this.listPack);
    // console.log("list pack ",this.listPack)
    this.eventService.syncFamilyEvent.next(true);
  }

  getPackList() {
    return from(Array.from(this.packs.getValue().values()));
  }


}
