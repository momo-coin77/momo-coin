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
  packs: Pack[] = [];
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
      this.packs = pack.filter((p: Pack) => !this.listHistoryPacks.has(p.id.toString().toString()))
        .map((p: Pack) => {
          let npack = new Pack();
          npack.hydrate(p.toString());
          this.listHistoryPacks.set(npack.id.toString().toString(), true);
          npack.saleDate = (new Date(npack.saleDate)).toLocaleDateString();
          return npack;
        });
    });
  }

  showNotification(from, align, colortype, icon, text) {
    this.notification.showNotification(from, align, colortype, icon, text);
  }
}
