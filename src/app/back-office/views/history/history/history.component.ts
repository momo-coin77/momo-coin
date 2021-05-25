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
  packs: { waitResponse: boolean, pack: Pack[] }[] = [];
  listHistoryPacks: Map<string, boolean> = new Map<string, boolean>();
  numHistoryPack: number = 0;

  constructor(private notification: NotificationService,
    private history: UserHistoryService) {
  }

  ngOnInit() {
    this.getPacksHistory();
  }

  getPacksHistory() {
    this.history.history.subscribe((pack: Pack[]) => {
      this.packs.push({
      waitResponse: false,
      pack,
    });
    });
  }

  showNotification(from, align, colortype, icon, text) {
    this.notification.showNotification(from, align, colortype, icon, text);
  }
}
