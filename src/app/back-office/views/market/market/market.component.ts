import { Component, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
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


@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})

@Pipe({ name: 'convertFrom24To12Format' })
export class MarketComponent implements OnInit, PipeTransform {
  close: boolean;
  open: boolean;
  hh: number;
  packs: { user: User, pack: Pack }[] = [];
  private updateSubscription: Subscription;
  href: string;
  @ViewChild('secondModal') public secondModal: ModalDirective;
  @ViewChild('firstModal') public firstModal: ModalDirective;

  constructor(private router: Router,
    private modalService: BsModalService,
    // private packService: PackService
    private userService: UserService,
    private marketService: MarketService
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

  transform(time: any): any {
    let hour = (time.split(':'))[0]
    let min = (time.split(':'))[1]
    let part = hour > 12 ? 'pm' : 'am';
    min = (min + '').length == 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour + '').length == 1 ? `0${hour}` : hour;
    return `${hour}:${min} ${part}`
  }

  show2() {
    console.log('teste pop');
    this.secondModal.show();
  }

  show1() {
    console.log('teste modal');
    this.firstModal.show();
  }

  ok() { }

  calculDate() {
  }

  OnDestroy(): void {
    this.open = false;
    this.close = false;
  }

}
