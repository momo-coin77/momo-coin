import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Observable, interval, } from 'rxjs';
import { ConfigAppService } from '../../../../shared/service/config-app/config-app.service';
import { MarketService } from '../../../../shared/service/market/market.service';
import { NotificationService } from '../../../../shared/service/notification/notification.service';


@Component({
    selector: 'app-wait',
    templateUrl: './wait.component.html',
    styleUrls: ['./wait.component.scss']
})
export class WaitComponent implements OnInit {
    close: boolean;
    open: boolean;
    hh: number;
    href: string;
    private updateSubscription: Subscription;

    constructor(private router: Router,
        private  configAppService: ConfigAppService) {
        this.configAppService.checkMarketTime();
    }

    ngOnInit() {
        this.updateSubscription = interval(3000).subscribe(
            (val) => {
                this.configAppService.checkMarketTime();
            });
    }

    OnDestroy(): void {
        this.open = false;
        this.close = false;
    }
}
