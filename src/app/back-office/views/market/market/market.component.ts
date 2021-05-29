import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { interval, Subscription } from 'rxjs';
import { gainConfig, Pack, PackGain } from '../../../../shared/entity/pack';
import { User } from '../../../../shared/entity/user';
import { ResultStatut } from '../../../../shared/service/firebase/resultstatut';
import { MarketService } from '../../../../shared/service/market/market.service';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { PackService } from '../../../../shared/service/pack/pack.service';
import { UserService } from '../../../../shared/service/user/user.service';
import * as _ from 'lodash';
import { BasicPackService } from '../../../../shared/service/pack/basic-pack.service';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../../../shared/service/auth/auth.service';
import { EventService } from '../../../../shared/service/event/event.service';


@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})

export class MarketComponent implements OnInit, OnDestroy {
  close: boolean;
  open: boolean;
  href: string;
  hh: number;
  searchPacks: Pack[] = [];
  date: Date;
  search = '';
  currentUserPhone: string;
  packs: { waitResponse: boolean, pack: Pack, user: User, selectForm: FormControl }[] = [];
  listPacks: Map<string, boolean> = new Map<string, boolean>();
  currentPack: { waitResponse?: boolean, pack?: Pack, user?: User, selectForm?: FormControl } = {};
  gainList = Object.keys(gainConfig).map((key) => Object.create({}, { value: { value: gainConfig[key] }, key: { value: key } }));
  hasCurrentPack: boolean = false;
  // packs: { user: User, pack: Pack }[] = [];


  private updateSubscription: Subscription;
  private dataMarketSubscription: Subscription;
  @ViewChild('secondModal') public secondModal: ModalDirective;
  @ViewChild('firstModal') public firstModal: ModalDirective;

  resultOperation = { okresult: false, message: "" };

  constructor(private router: Router,
    private authService: AuthService,
    private modalService: BsModalService,
    private packService: BasicPackService,
    private userService: UserService,
    private marketService: MarketService,
    private notification: NotificationService,
    private eventService:EventService
  ) {
    this.marketService.marketTime();
    this.calculDate();
    
    this.authService.currentUserSubject.subscribe((user: User) => {
      this.currentUserPhone = user.phone;
    });
  }


  ngOnInit() {
    
    this.authService.currentUserSubject.subscribe((user: User) => {
      this.currentUserPhone = user.phone;
    });

    this.updateSubscription = interval(3000).subscribe(
      (val) => {
        return this.marketService.marketTime();
      });

      this.eventService.newPackArrivedEvent.subscribe((arrived:boolean)=>{
        if(!arrived) return;
        this.listPacks.clear();
        this.packs=[];
        this.searchPacks=[];
      })

    this.dataMarketSubscription = this.marketService.getAllPackInMarket().subscribe((pack: Pack) => {
      this.userService.getUserById(pack.idOwner)
        .then((result: ResultStatut) => {
          if (!this.listPacks.has(pack.id.toString().toString())) {
            this.packs.push({
              waitResponse: false,
              pack,
              user: result.result,
              selectForm: new FormControl(this.gainList[0].key)
            });
            this.searchPacks.push(pack);
            this.listPacks.set(pack.id.toString().toString(), true);
          }
        })
    });
  }

  getArrayPacks() {
    // this.packService.getPackList();
    // return (pack: Pack[]) => this.searchPacks = this.packs = pack
  }

  searchPack() {
    this.searchPacks = _.filter(this.packs, (pack) => _.includes(pack.amount, this.search) || _.includes(pack.network, this.search))
  }

  show2() {
    // console.log('teste pop');
    this.secondModal.show();
    let gain: PackGain = {
      jour: +this.currentPack.selectForm.value,
      pourcent: gainConfig[this.currentPack.selectForm.value]
    }
    // console.log('Gain ',gain)

    this.packService.BuyAPack(this.currentPack.pack, gain)
      .then((result: ResultStatut) => {
        let date = new Date();
        date.setHours(date.getHours() + 5);
        this.resultOperation.okresult = true;
        this.resultOperation.message = '\<b>Infos !\</b>\<br>The owner of the pack has been informed of your request being the transfer of money. Please complete the transfer before ' + date.toUTCString()
        // this.listPacks.clear();
        // this.packs=[];

      })
      .catch((error: ResultStatut) => {
        this.resultOperation.okresult = false;
        this.resultOperation.message = '\<b>Sorry !\</b>\<br> Error when selecting the pack <br/>' + error.message;
      })

  }

  show1(pack) {
    this.currentPack = pack;
    this.hasCurrentPack = true;
    this.firstModal.show();
  }

  showNote() {
    this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br> message error');
  }

  ok() {
    setTimeout(() => {
      // this.packs
      let state = this.resultOperation.okresult ? 'success' : 'danger';
      this.notification.showNotification('top', 'center', state, 'pe-7s-close-circle', this.resultOperation.message, 5000);
    }, 100)
    setTimeout(() => {
      this.router.navigate(['/market']);
    }, 300);
  }

  calculDate() {

  }
  ngOnDestroy(): void {
    // this.dataMarketSubscription.unsubscribe()
  }
  OnDestroy(): void {
    this.open = false;
    this.close = false;
  }
}
