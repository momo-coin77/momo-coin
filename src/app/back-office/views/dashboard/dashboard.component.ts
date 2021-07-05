import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { interval, Subscription } from 'rxjs';
import { MarketService } from '../../../shared/service/market/market.service';
import { Pack } from '../../../shared/entity/pack';
import { AuthService } from '../../../shared/service/auth/auth.service';
import { User } from '../../../shared/entity/user';
import { ProfilService } from '../../../shared/service/profil/profil.service';
import { EventService } from '../../../shared/service/event/event.service';
import { NotificationService } from '../../../shared/service/notification/notification.service';
import { BsModalService, ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { BasicPackService } from '../../../shared/service/pack/basic-pack.service';
import { ResultStatut } from '../../../shared/service/firebase/resultstatut';
// import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  
  @ViewChild('showSaleBonus') public showSaleBonus: ModalDirective;
  bonus: number = 0;
  nextBonus: number = 0;
  saleBonus: boolean = false;
  private updateSubscription: Subscription;
  activeUser: number; // valeur fictive du nombre d'utilisateurs en ligne.
  allUsers: number = 1500;  // valeur fictive du nombre total d'utilisateurs. créé la
  // fonctionnalité dans les service (utilisable par la suite dans admin) mais laisser ici fictif.
  balence: number = 0; // somme de toutes les montants de chaqueq pack avec son id
  bonusBalence: number = 0; // Bonus de pa
  saleBalence: number = 0;
  listPurchasePacks: Map<string, boolean> = new Map<string, boolean>();
  listSalePacks: Map<string, boolean> = new Map<string, boolean>();
  numPurchasePack: number = 0;
  numSalePack: number = 0;
  allSaleAmount: number = 0;
  allPurchaseAmount: number = 0;
  allAmount: number = 0;
  waitResponse = false;

  constructor(
    private notification: NotificationService,
    private myPack: MarketService,
    private authService: AuthService,
    private bsModal: BsModalService,
    // private translate:TranslateService,
    private eventService: EventService,
    private basicPackService:BasicPackService,
    private profilService: ProfilService) {
    this.getPurchasePacks();
    this.getSalePacks();
  }

  randomNumber(m?: number, k?: number, c?: number) {
    if (!m) { m = 300; }
    // if (!k) { k = 0; }
    // if (!c) { c = 0; }
    let mm = Math.floor((Math.random() * m) + 1);
    // let kk = Math.floor((Math.random() * k) + 1);
    // let cc = Math.floor((Math.random() * c) + 1);
    let d = new Date();
    let val = 400;
    let hh = d.getHours();
    if (hh > 22) {
      val = 200;
    }
    if (hh < 7) {
      val = 100;
    }
    let number = val + mm;
    // console.log('random: ' + number);
    return number;
  }

  ngOnInit(): void {
    this.updateSubscription = interval(8000).subscribe(
      (val) => {
        this.activeUser = this.randomNumber(50);
      });

    this.authService.currentUserSubject.subscribe((user: User) => {
      this.bonus = user.bonus;
      if(user.bonus >= 15000) {
        this.saleBonus = true;
        this.nextBonus = user.bonus - 15000;
      }
    });

    this.getPurchasePacks();
    this.getSalePacks();

    this.profilService.balancedAccountObservable.subscribe((balance: number) => {
      // console.log("Balance ",balance)
      this.balence = balance;
    })
    // this.eventService
    // .newPackArrivedEvent
    // .subscribe((arrived:boolean)=>{
    //   if(!arrived) return;
    //   console.log("Clear")
    //   this.listPurchasePacks.clear();
    //   this.listSalePacks.clear();
    //   this.numPurchasePack=0;
    //   this.numSalePack=0;
    // })
  }

  getPurchasePacks() {
    this.myPack.getMyOrderdPackNotInMarket().subscribe((pack: Pack) => {
      // console.log("Arrived")
      if (!this.listPurchasePacks.has(pack.id.toString().toString())) {
        this.listPurchasePacks.set(pack.id.toString().toString(), true);
        this.allAmount = this.allAmount + pack.amount;
        this.numPurchasePack++;
      }
      // this.allAmount = this.allPurchaseAmount + this.allAmount;
    });
    // console.log(this.allAmount)
  }

  getSalePacks() {
    this.myPack.getMyOrderedPackOnMarket().subscribe((pack: Pack) => {
      if (!this.listSalePacks.has(pack.id.toString().toString())) {
        this.listSalePacks.set(pack.id.toString().toString(), true);
        this.allAmount = this.allAmount + pack.amount;
        this.numSalePack++;
      }
    });
    // this.allAmount = this.allSaleAmount + this.allAmount;
  }
  saleMyBonus() {
    this.waitResponse = true;
    this.basicPackService.transfertBonusToPack()
    .then((result: ResultStatut) => {
      this.waitResponse = false;
      this.showSaleBonus.hide()
      this.notification.showNotification('top', 'center', 'success', 'pe-7s-close-circle', '\<b>Success !\</b>\<br>15000MC \</b>of your bonuses have been put on the market');
    })
      .catch((error:ResultStatut) => {
        let message="";
        this.showSaleBonus.hide()
        if(error.apiCode==ResultStatut.INVALID_ARGUMENT_ERROR) message =error.message;
        else message="\<b>Oops!!\</b>Unknow error. please contact administrator <br> contact.momo.coin@gmail.com"
        setTimeout(() => this.notification.showNotification('top', 'center', 'danger', '', 'An error has occurred <br/>'), 200)
        this.waitResponse = false;
      })
    }

    showModal() {
      this.showSaleBonus.show();
    }
    hideModal() {
      this.showSaleBonus.hide();
    }
}
