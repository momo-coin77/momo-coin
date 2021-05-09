import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../shared/service/notification/notification.service';


@Component({
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})

export class MarketComponent implements OnInit {

  constructor(private notification: NotificationService) { }

  ngOnInit() {

  }

  showNotification(from, align, colortype, icon, text) {
    this.notification.showNotification(from, align, colortype, icon, text);
  }
}
