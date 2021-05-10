import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Observable, interval, } from 'rxjs';
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

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.updateSubscription = interval(3000).subscribe(
            (val) => {
                this.href = this.router.url;
                let tab = this.href.split("/");
                let d = new Date();
                let hh = d.getMinutes();
                this.hh = hh;
                console.log(this.hh);
                if(tab[1] === 'market'){
                    this.market(this.hh);
                };
            });
    }

    market(hh) {
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
