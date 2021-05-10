import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { NotificationService } from '../../../../shared/service/notification/notification.service';


@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})

export class MarketComponent implements OnInit {
  close: boolean;
  open: boolean;
  hh: number;
  private updateSubscription: Subscription;
  href: string;

  constructor(private router: Router) {
    let d = new Date();
    let hh = d.getMinutes();
    this.market(hh);
    this.hh = hh;
  }

  ngOnInit() {
    this.updateSubscription = interval(3000).subscribe(
      (val) => {
        this.href = this.router.url;
        let tab = this.href.split('/');
        let d = new Date();
        let hh = d.getMinutes();
        this.hh = hh;
        console.log(this.hh);
        if (tab[1] === 'market') {
          this.market(this.hh);
        };
      });
  }

  market(hh) {
    // if (hh != 11 && hh
        if (hh == 11 || hh == 13 || hh == 15 || hh == 17) {
          this.close = true;
          return this.router.navigate(['market/open']);
      } else {
          this.open = true;
          return this.router.navigate(['market/wait']);
      }
  }
  OnDestroy(): void {
    this.open = false;
    this.close = false;
  }
}
