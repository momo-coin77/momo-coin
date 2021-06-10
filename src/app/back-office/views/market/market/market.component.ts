import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { BehaviorSubject, combineLatest, interval, Subscription } from 'rxjs';
import { gainConfig, Pack, PackBuyState, PackGain, PackState } from '../../../../shared/entity/pack';
import { User } from '../../../../shared/entity/user';
import { ResultStatut } from '../../../../shared/service/firebase/resultstatut';
import { MarketService } from '../../../../shared/service/market/market.service';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { PackService } from '../../../../shared/service/pack/pack.service';
import * as _ from 'lodash';
import { BasicPackService } from '../../../../shared/service/pack/basic-pack.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../shared/service/auth/auth.service';
import { EventService } from '../../../../shared/service/event/event.service';
import { UserService } from '../../../../shared/service/user/user.service';
import { TranslateService } from '@ngx-translate/core';
import { combineAll, mergeAll } from 'rxjs/operators';

enum FilterNetwork {
  ALL = "All",
  MTN_MONEY = "MTN Money",
  ORANGE_MONEY = "Orange Money"
}

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

  montantFilter: BehaviorSubject<Number> = new BehaviorSubject<Number>(-1);
  networkTypeFilter: BehaviorSubject<FilterNetwork> = new BehaviorSubject<FilterNetwork>(FilterNetwork.ALL);

  formFilter: FormGroup;
  hasFilter = false;
  waitForPackOnlineState: boolean = true;

  private updateSubscription: Subscription;
  private dataMarketSubscription: Subscription;
  @ViewChild('secondModal') public secondModal: ModalDirective;
  @ViewChild('firstModal') public firstModal: ModalDirective;

  resultOperation = { okresult: false, message: '' };

  constructor(private router: Router,
    private authService: AuthService,
    private modalService: BsModalService,
    private packService: BasicPackService,
    private userService: UserService,
    private marketService: MarketService,
    private notification: NotificationService,
    public translate: TranslateService,
    private eventService: EventService
  ) {
    this.marketService.marketTime();
    this.calculDate();
    // this.refreshFonct();

    this.authService.currentUserSubject.subscribe((user: User) => {
      this.currentUserPhone = user.phone;
    });
    this.formFilter = new FormGroup({
      "networkFilter": new FormControl(FilterNetwork.ALL),
      "amountFilter": new FormControl(this.montantFilter.getValue())
    });
  }
  onFilter() {
    this.hasFilter = true;
    this.networkTypeFilter.next(this.formFilter.value.networkFilter),
      this.montantFilter.next(+this.formFilter.value.amountFilter);
  }
  resetFilter() {
    this.hasFilter = true;
    this.networkTypeFilter.next(FilterNetwork.ALL),
      this.montantFilter.next(-1);
    this.formFilter.controls.networkFilter.setValue(FilterNetwork.ALL);
    this.formFilter.controls.amountFilter.setValue(-1)
  }


  ngOnInit() {

    this.authService.currentUserSubject.subscribe((user: User) => {
      this.currentUserPhone = user.phone;
    });

    this.updateSubscription = interval(3000).subscribe(
      (val) => {
        return this.marketService.marketTime();
      });

    this.eventService.newPackArrivedEvent.subscribe((arrived: boolean) => {
      if (!arrived) return;
      this.listPacks.clear();
      this.packs = [];
      this.searchPacks = [];
    })

    // this.dataMarketSubscription = 
    combineLatest([this.marketService.packs, this.montantFilter, this.networkTypeFilter])
      .subscribe(([packs, montant, network]) => {
        if (this.hasFilter) this.eventService.newPackArrivedEvent.next(true);

        Array.from(packs.values())
          .filter((pack: Pack) => pack.state == PackState.ON_MARKET)
          .forEach((pack) => {
            this.userService.getUserById(pack.idOwner)
              .then((result: ResultStatut) => {
                console.log(network, result.result.network)
                if (!this.listPacks.has(pack.id.toString().toString())) {
                  if (montant == -1 || montant == pack.amount) {
                    if (network == FilterNetwork.ALL || network == result.result.network) {
                      this.packs.push({
                        waitResponse: false,
                        pack,
                        user: result.result,
                        selectForm: new FormControl(this.gainList[0].key)
                      });
                      this.searchPacks.push(pack);
                      this.listPacks.set(pack.id.toString().toString(), true);
                    }
                  }
                }
              })
          })

      })
    // this.marketService.getAllPackInMarket().subscribe((pack: Pack) => {

    // });
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
    let gain: PackGain = {
      jour: +this.currentPack.selectForm.value,
      pourcent: gainConfig[this.currentPack.selectForm.value]
    }
    this.waitForPackOnlineState = true;
    // console.log('Gain ',gain)
    this.packService.getOnlinePack(this.currentPack.pack.id)
      .then((result: ResultStatut) => {
        let pack: Pack = result.result;
        if (pack.state != PackState.ON_MARKET || pack.buyState != PackBuyState.ON_WAITING_BUYER) {
          let result: ResultStatut = new ResultStatut();
          result.code = ResultStatut.INVALID_ARGUMENT_ERROR;
          return Promise.reject(result);
        }
        return this.packService.BuyAPack(this.currentPack.pack, gain)
      })
      .then((result: ResultStatut) => {

        this.waitForPackOnlineState = false;
        this.resultOperation.okresult = true;
        this.secondModal.show();
        let date = new Date();
        date.setHours(date.getHours() + 5);
        this.resultOperation.message = '\<b>Infos !\</b>\<br>The owner of the pack has been informed of your request being the transfer of money. Please complete the transfer before ' + date.toUTCString()
      })
      .catch((error: ResultStatut) => {
        let style = 'info';
        this.waitForPackOnlineState = false;
        this.resultOperation.okresult = false;
        if (error.code == ResultStatut.INVALID_ARGUMENT_ERROR) {
          this.resultOperation.message = '\<b>Sorry !\</b>\<br> This pack is no longer available. You can buy another one';
          style = 'warning';
        }
        else {
          this.resultOperation.message = '\<b>Sorry !\</b>\<br> Error when selecting the pack <br/>' + error.message;
          style = 'danger';
        }

        this.notification.showNotification('top', 'center', style, 'pe-7s-close-circle', this.resultOperation.message);
      })

  }

  show1(pack) {
    // console.log("Show pack ",pack)
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

  refreshFonct() {
    window.location.reload();
}

  OnDestroy(): void {
    this.open = false;
    this.close = false;
  }
}
