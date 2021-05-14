import { Component, OnInit } from '@angular/core';
import { Pack } from '../../../../shared/entity/pack';
import { MarketService } from '../../../../shared/service/market/market.service';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { BasicPackService } from '../../../../shared/service/pack/basic-pack.service';


@Component({
  templateUrl: 'purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})

export class PurchasesComponent implements OnInit {

  packs: { waitResponse: boolean, pack: Pack }[] = [];
  search = '';
  searchPacks: { waitResponse: boolean, pack: Pack }[] = [];

  constructor( private myPack: MarketService, private notifService: NotificationService) { }

  ngOnInit() {
    this.getPacks();
  }

  getPacks() {
    this.myPack.getMyOrderdPackNotInMarket().subscribe((pack: Pack) => {
      this.packs.push({ waitResponse: false, pack})

    })
  }
}
