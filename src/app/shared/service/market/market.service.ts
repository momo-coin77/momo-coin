import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from } from 'rxjs';
import { Pack, PackState } from '../../entity/pack';
import { AuthService } from '../auth/auth.service';
import { FirebaseApi } from '../firebase/FirebaseApi';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  listPack: Map<String, Pack> = new Map<String, Pack>();
  packs: BehaviorSubject<Map<String, Pack>> = new BehaviorSubject<Map<String, Pack>>(this.listPack)
  constructor(
    private authService: AuthService,
    private firebaseApi: FirebaseApi,
    private router: Router) {

    this.authService.currentUserSubject.subscribe((user) => {
      if (!user) return;
      //cette requete ne doit ce faire que si le marché est ouvert
      this.firebaseApi.getFirebaseDatabase()
        .ref('packs')
        .limitToLast(200)
        .orderByChild('amount')
        .equalTo(PackState.ON_MARKET, 'state')
        .on('value', (snapshot) => this.newPackFromMarket(snapshot))
    })
  }

  newPackFromMarket(pack: any) {
    let pck: Pack = new Pack();
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
      if (hh == 10 || hh == 11 || hh == 18 || hh == 19) {
        return this.router.navigate(['market/open']);
      } else {
        return this.router.navigate(['market/wait']);
      }
    };
  }

}
