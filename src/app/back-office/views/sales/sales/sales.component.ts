import { Component, OnInit } from '@angular/core';
import { Pack } from '../../../../shared/entity/pack';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { BasicPackService } from '../../../../shared/service/pack/basic-pack.service';
import * as _ from 'lodash';
import { MarketService } from '../../../../shared/service/market/market.service';
import { EventService } from '../../../../shared/service/event/event.service';


@Component({
  templateUrl: 'sales.component.html',
  styleUrls: ['./sales.component.scss']
})

export class SalesComponent implements OnInit {


  packs: { waitResponse: boolean, pack: Pack }[] = [];
  search = '';
  searchPacks: { waitResponse: boolean, pack: Pack }[] = [];
  listSalePacks: Map<string, boolean> = new Map<string, boolean>();

  constructor(private myPack: MarketService,
    private packService: BasicPackService,
    private eventService:EventService,
    private notifService: NotificationService) { }

  ngOnInit() {
    this.eventService.newPackArrivedEvent.subscribe((arrived:boolean)=>{
      if(!arrived) return;
      this.listSalePacks.clear();
      this.packs=[];
      this.searchPacks=[];
    })
    this.getPacks();
  }

  getPacks() {
    this.myPack.getMyOrderedPackOnMarket().subscribe((pack: Pack) => {
      if (!this.listSalePacks.has(pack.id.toString().toString())) {
        this.listSalePacks.set(pack.id.toString().toString(), true);
        this.packs.push({ waitResponse: false, pack});
      }

    });
  }

}
