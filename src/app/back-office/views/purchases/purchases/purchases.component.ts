import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../shared/service/notification/notification.service';


@Component({
  templateUrl: 'purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})

export class PurchasesComponent implements OnInit {
  
  constructor(private notification: NotificationService) { }

  ngOnInit() {

  }

  showNotification(from, align, colortype, icon, text) {
    this.notification.showNotification(from, align, colortype, icon, text);
  }
}
