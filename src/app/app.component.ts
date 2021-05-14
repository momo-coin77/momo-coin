import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DataStateUpdateService } from './shared/service/data-state-update/data-state-update.service';
import { UserlocalstorageService } from './shared/service/localstorage/userlocalstorage.service';
import { UserNotificationService } from './shared/service/user-notification/user-notification.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MoMo-Coin';
  constructor(
    private router: Router,
    private userNotification:UserNotificationService,
    private updateDataUser:DataStateUpdateService) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
