import { Component, OnInit } from '@angular/core';
import { Pack } from '../../../../shared/entity/pack';
import { User } from '../../../../shared/entity/user';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { PlanService } from '../../../../shared/service/opperations/plan.service';
// import { UserFamillyService } from '../../../../shared/service/user-familly/user-familly.service';


@Component({
  templateUrl: 'familly.component.html',
  styleUrls: ['./familly.component.scss']
})

export class FamillyComponent implements OnInit {
  packs: Pack[] = [];
  listFamillyPacks: Map<string, boolean> = new Map<string, boolean>();
  numFamillyPack: number = 0;

  constructor(private notification: NotificationService,
    // private Familly: UserFamillyService
    ) {
  }

  ngOnInit() {
    this.getPacksFamilly();
  }

  getPacksFamilly() {
  //   this.familly.familly.subscribe((pack: Pack[]) => {
  // // console.log("listory ",pack)
  //     this.packs = pack
  //     // .filter((p: Pack) => !this.listFamillyPacks.has(p.id.toString().toString()))
  //       .map((p: Pack) => {
  //         let npack = new Pack();
  //         npack.hydrate(p.toString());
  //         // this.listFamillyPacks.set(npack.id.toString().toString(), true);
  //         npack.saleDate = (new Date(npack.saleDate)).toLocaleDateString();
  //         return npack;
  //       });
  //   });
  }

  showNotification(from, align, colortype, icon, text) {
    this.notification.showNotification(from, align, colortype, icon, text);
  }
}
