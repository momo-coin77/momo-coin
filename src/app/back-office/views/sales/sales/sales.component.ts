import { Component, OnInit } from '@angular/core';
import { Pack } from '../../../../shared/entity/pack';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { BasicPackService } from '../../../../shared/service/pack/basic-pack.service';
import * as _ from 'lodash';
import { MarketService } from '../../../../shared/service/market/market.service';


@Component({
  templateUrl: 'sales.component.html',
  styleUrls: ['./sales.component.scss']
})

export class SalesComponent implements OnInit {
  

  packs: { waitResponse: boolean, pack: Pack }[] = [];
  search = '';
  searchPacks: { waitResponse: boolean, pack: Pack }[] = [];

  constructor(private myPack: MarketService, private packService: BasicPackService, private notifService: NotificationService) { }

  ngOnInit() {
    this.getPacks();
  }

  getPacks() {
    this.myPack.getMyOrderedPackOnMarket().subscribe((pack: Pack) => {
      this.packs.push({ waitResponse: false, pack});

    });
  }

}
