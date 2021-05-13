import { Component, OnInit } from '@angular/core';
import { Pack } from '../../../../shared/entity/pack';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { BasicPackService } from '../../../../shared/service/pack/basic-pack.service';
import * as _ from 'lodash';


@Component({
  templateUrl: 'sales.component.html',
  styleUrls: ['./sales.component.scss']
})

export class SalesComponent implements OnInit {

  packs: { waitResponse: boolean, pack: Pack }[] = [];
  search = '';
  searchPacks: { waitResponse: boolean, pack: Pack }[] = [];

  constructor(private packService: BasicPackService, private notifService: NotificationService) { }

  ngOnInit() {
    this.getPacks();
  }

  getPacks() {
    this.packService.packList.subscribe((packs: Map<string, Pack>) => {
      this.packs = Array.from(packs.values()).map((pack) => {
        return { waitResponse: false, pack }
      })
      console.log(this.packs)
      // this.searchPack();
    })
  }

}
