import { Component, OnInit } from '@angular/core';
import { Pack } from '../../../../../shared/entity/pack';
import * as _ from 'lodash';
import { BasicPackService } from '../../../../../shared/service/pack/basic-pack.service';
import { NotificationService } from '../../../../../shared/service/notification/notification.service';

@Component({
  selector: 'app-lists-pack',
  templateUrl: './lists-pack.component.html',
  styleUrls: ['./lists-pack.component.scss']
})
export class ListsPackComponent implements OnInit {

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
        return { waitResponse: false, pack };
      });
      this.searchPack();
    });
  }

  deletePack(id) {
    // this.packService.deletePack(id)
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
  }

  changeStatusMarket(pack) {
    pack.waitResponse = true;
    this.packService.changeStatusMarket(pack.pack)
      .then((result) => {
        pack.waitResponse = false;
        this.notifService.showNotificationWithoutTimer('top', 'center', 'success', '', `\<b>Success !\</b>\<br>The market status of the pack has been updated to '${pack.pack.status}'`);
      })
      .catch((error) => {
        pack.waitResponse = false;
        this.notifService.showNotificationWithoutTimer('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>' + error.message);
      });
  }
  searchPack() {
    this.searchPacks = _.filter(this.packs, (pack) => _.includes(pack.pack.idOwner, this.search) ||
      _.includes(pack.pack.amount, this.search) ||
      _.includes(pack.pack.state, this.search));
  }

}
