import { Component, OnInit, Pipe, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { interval, Subscription } from 'rxjs';
import { Pack } from '../../../../shared/entity/pack';
import { User } from '../../../../shared/entity/user';
import { ResultStatut } from '../../../../shared/service/firebase/resultstatut';
import { MarketService } from '../../../../shared/service/market/market.service';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { PackService } from '../../../../shared/service/pack/pack.service';
import { UserService } from '../../../../shared/service/user/user.service';
import * as _ from 'lodash';


@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})

export class MarketComponent implements OnInit {
  close: boolean;
  open: boolean;
  href: string;
  hh: number;
  searchPacks : Pack[] = [];
  search = '';
  packs : Pack[] = [];
  // packs: { user: User, pack: Pack }[] = [];


  private updateSubscription: Subscription;
  @ViewChild('secondModal') public secondModal: ModalDirective;
  @ViewChild('firstModal') public firstModal: ModalDirective;

  constructor(private router: Router,
    private modalService: BsModalService,
    private packService: PackService,
    private userService: UserService,
    private marketService: MarketService,
    private notification: NotificationService
  ) {
    this.marketService.marketTime();
    this.calculDate();
  }

  ngOnInit() {
    this.updateSubscription = interval(3000).subscribe(
      (val) => {
          return this.marketService.marketTime();
      });

    this.marketService.getPackList()
      .subscribe((pack: Pack) => {
        // this.userService.getUserById(pack.idOwner)
        //   .then((result: ResultStatut) => {
        //     this.packs.push({ user: result.result, pack })
        //   })
        // }),
        // this.packService.packList.subscribe((packages: Map<String, Pack>) => {
        //   this.posts = this.packService.getPackList();
      });
  }

  getPacks(){
    this.packService.getPackList();
    return (pack: Pack[]) => this.searchPacks=this.packs=pack
  }

  searchPack() {
    this.searchPacks =
     // tslint:disable-next-line:max-line-length
     _.filter(this.packs, (pack) => _.includes(pack.email, this.search) || _.includes(pack.firstName, this.search) || _.includes(pack.lastName, this.search))
   }

  show2() {
    console.log('teste pop');
    this.secondModal.show();
  }

  show1() {
    console.log('teste modal');
    this.firstModal.show();
  }

  showNote(){
    this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br> message error');
  }

  ok() { }

  calculDate() {
  }

  OnDestroy(): void {
    this.open = false;
    this.close = false;
  }

}
