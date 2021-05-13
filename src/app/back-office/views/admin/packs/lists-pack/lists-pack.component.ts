import { Component, OnInit } from '@angular/core';
import { Pack } from '../../../../../shared/entity/pack';
import * as _ from 'lodash';
import { BasicPackService } from '../../../../../shared/service/pack/basic-pack.service';

@Component({
  selector: 'app-lists-pack',
  templateUrl: './lists-pack.component.html',
  styleUrls: ['./lists-pack.component.scss']
})
export class ListsPackComponent implements OnInit {

  packs: Pack[] = [];
  search = '';
  searchPacks: Pack[] = [];

  constructor(private packService: BasicPackService) { }

  ngOnInit() {
    this.getPacks();
  }

  getPacks() {
    // this.packService.getPacks();
    // return ((pack: Pack[]) => this.searchPacks = this.packs = pack);
  }

  deletePack(id) {
    // this.packService.deletePack(id)
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
  }

  changeStatus(pack) {

    // this.packService.changeStatus({ active: !pack.active }, pack.id)
    //   .then((resp) => console.log(resp))
    //   .catch((err) => console.error(err));
  }
  searchPack() {
    this.searchPacks =
      // tslint:disable-next-line:max-line-length
      _.filter(this.packs, (pack) => _.includes(pack.idOwner, this.search) || _.includes(pack.amount, this.search) || _.includes(pack.status, this.search));
  }

}
