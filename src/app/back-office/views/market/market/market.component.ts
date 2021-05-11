import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { interval, Subscription } from 'rxjs';
import { Pack } from '../../../../shared/entity/pack';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { PackService } from '../../../../shared/service/pack/pack.service';


@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})

export class MarketComponent implements OnInit {
  close: boolean;
  open: boolean;
  hh: number;
  posts: any;
  private updateSubscription: Subscription;
  href: string;
  @ViewChild('secondModal') public secondModal: ModalDirective;
  @ViewChild('firstModal') public firstModal: ModalDirective;

  constructor(private router: Router,
    private modalService: BsModalService,
    private packService: PackService) {
  }

  ngOnInit() {
    this.updateSubscription = interval(3000).subscribe(
      (val) => {
        this.href = this.router.url;
        let tab = this.href.split('/');
        let d = new Date();
        let hh = d.getMinutes();
        this.hh = hh;
        // console.log(this.hh);
        if (tab[1] === 'market') {
          // this.market(this.hh);
        };
      });
    this.packService.packList.subscribe((packages: Map<String, Pack>) => {
      this.posts = this.packService.getPackList();
    });
  }

  market(hh) {
      if(hh == 11 || hh == 13 || hh == 15 || hh == 17) {
      this.close = true;
      return this.router.navigate(['market/open']);
    } else {
      this.open = true;
      return this.router.navigate(['market/wait']);
    }
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

  OnDestroy(): void {
    this.open = false;
    this.close = false;
  }

}
