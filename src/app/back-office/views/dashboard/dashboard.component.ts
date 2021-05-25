import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { interval, Subscription } from 'rxjs';
import { MarketService } from '../../../shared/service/market/market.service';
import { Pack } from '../../../shared/entity/pack';
import { AuthService } from '../../../shared/service/auth/auth.service';
import { User } from '../../../shared/entity/user';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  bonus: number = 0;
  private updateSubscription: Subscription;
  activeUser: number; // valeur fictive du nombre d'utilisateurs en ligne.
  stockholders: number = 27;  // valeur fictive du nombre total d'utilisateurs. créé la
  // fonctionnalité dans les service (utilisable par la suite dans admin) mais laisser ici fictif.
  balence: number = 0; // somme de toutes les montants de chaqueq pack avec son id
  bonusBalence: number = 0; // Bonus de pa
  saleBalence: number = 0;
  listPurchasePacks: Map<string, boolean> = new Map<string, boolean>();
  listSalePacks: Map<string, boolean> = new Map<string, boolean>();
  numPurchasePack: number = 0;
  numSalePack: number = 0;

  constructor(private myPack: MarketService,
    private authService: AuthService) {
    this.getPurchasePacks();
    this.getSalePacks();
  }

  randomNumber(m?: number, k?: number, c?: number) {
    if (!m) { m = 100; }
    // if (!k) { k = 0; }
    // if (!c) { c = 0; }
    let mm = Math.floor((Math.random() * m) + 1);
    // let kk = Math.floor((Math.random() * k) + 1);
    // let cc = Math.floor((Math.random() * c) + 1);
    let d = new Date();
    let val = 10;
    let hh = d.getHours();
    if (hh > 21) {
      val = 10;
    }
    if (hh < 7) {
      val = 5;
    }
    let number = val + mm;
    console.log('random: ' + number);
    return number;
  }

  ngOnInit(): void {
    this.updateSubscription = interval(8000).subscribe(
      (val) => {
        this.activeUser = this.randomNumber(10);
      });

    this.authService.currentUserSubject.subscribe((user: User) => {
      this.bonus = user.bonus;
    });

    this.getPurchasePacks();
    this.getSalePacks();
  }

  getPurchasePacks() {
    this.myPack.getMyOrderdPackNotInMarket().subscribe((pack: Pack) => {
      if (!this.listPurchasePacks.has(pack.id.toString().toString())) {
        this.listPurchasePacks.set(pack.id.toString().toString(), true);
        this.numPurchasePack++;
      }
    });
  }

  getSalePacks() {
    this.myPack.getMyOrderedPackOnMarket().subscribe((pack: Pack) => {
      if (!this.listSalePacks.has(pack.id.toString().toString())) {
        this.listSalePacks.set(pack.id.toString().toString(), true);
        this.numSalePack++;
      }
    });
  }
}
