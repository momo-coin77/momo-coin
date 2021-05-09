import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../shared/service/notification/notification.service';


@Component({
  templateUrl: 'sales.component.html',
  styleUrls: ['./sales.component.scss']
})

export class SalesComponent implements OnInit {

  constructor(private notification: NotificationService) { }

  ngOnInit() {

  }

  showNotification(from, align, colortype, icon, text) {
    this.notification.showNotification(from, align, colortype, icon, text);
  }
}
