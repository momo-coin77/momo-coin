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
  listPurchasePacks: Map<string, boolean> = new Map<string, boolean>();

  search = '';
  searchPacks: { waitResponse: boolean, pack: Pack }[] = [];

  constructor(private myPack: MarketService) { }

  ngOnInit() {
    this.getPurchasePacks();
  }

  getPurchasePacks() {
    this.myPack.getMyOrderdPackNotInMarket().subscribe((pack: Pack) => {
      if (!this.listPurchasePacks.has(pack.id.toString().toString())) {        
        
        this.listPurchasePacks.set(pack.id.toString().toString(), true);
        this.packs.push({ waitResponse: false, pack });
      }

  // console.log('Purchase packs list', this.packs);
      // this.searchPack();
    });
  }
}
