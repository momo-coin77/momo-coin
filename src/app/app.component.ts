import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import Bugsnag from '@bugsnag/js';
import { DataStateUpdateService } from './shared/service/data-state-update/data-state-update.service';
import { FirebaseApi } from './shared/service/firebase/FirebaseApi';
import { UserlocalstorageService } from './shared/service/localstorage/userlocalstorage.service';
import { TrackBugService } from './shared/service/track-bug/track-bug.service';
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
    private firebaseApi:FirebaseApi,
    private userNotification:UserNotificationService,
    private trackBugService:TrackBugService,
    private updateDataUser:DataStateUpdateService) { }

  ngOnInit() {
    //Bugsnag.notify(new Error('Test error'))
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
