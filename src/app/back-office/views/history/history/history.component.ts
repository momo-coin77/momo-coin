import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { PlanService } from '../../../../shared/service/opperations/plan.service';


@Component({
  templateUrl: 'history.component.html',
  styleUrls: ['./history.component.scss']
})

export class HistoryComponent implements OnInit {


  constructor(private notification: NotificationService,
              private calcul: PlanService) { 
                console.log(calcul.calculePlan(150000, 5))
              }

  ngOnInit() {
  }

  showNotification(from, align, colortype, icon, text) {
    this.notification.showNotification(from, align, colortype, icon, text);
  }
}
