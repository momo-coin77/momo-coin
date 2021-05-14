import { Component, OnInit } from '@angular/core';
import { Pack } from '../../../../shared/entity/pack';
import { User } from '../../../../shared/entity/user';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { PlanService } from '../../../../shared/service/opperations/plan.service';
import { UserHistoryService } from '../../../../shared/service/user-history/user-history.service';


@Component({
  templateUrl: 'history.component.html',
  styleUrls: ['./history.component.scss']
})

export class HistoryComponent implements OnInit {


  constructor(private notification: NotificationService,
              private history: UserHistoryService) {
                
              }

  ngOnInit() {
  }

  getPacksHistory()
  {
    this.history.history.subscribe((pack: Pack[]) => { 
      
    })
    ;
  }

  showNotification(from, align, colortype, icon, text) {
    this.notification.showNotification(from, align, colortype, icon, text);
  }
}
