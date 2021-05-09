import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../shared/service/notification/notification.service';


@Component({
  templateUrl: 'history.component.html',
  styleUrls: ['./history.component.scss']
})

export class HistoryComponent implements OnInit {


  constructor(private notification: NotificationService) { }

  ngOnInit() {
  }

  showNotification(from, align, colortype, icon, text) {
    this.notification.showNotification(from, align, colortype, icon, text);
  }
}
