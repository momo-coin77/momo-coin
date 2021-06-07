import { Component, OnInit } from '@angular/core';
import { Pack } from '../../../../shared/entity/pack';
import { User } from '../../../../shared/entity/user';
import { EventService } from '../../../../shared/service/event/event.service';
import { ResultStatut } from '../../../../shared/service/firebase/resultstatut';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { PlanService } from '../../../../shared/service/opperations/plan.service';
import { ProfilService } from '../../../../shared/service/profil/profil.service';
// import { UserFamillyService } from '../../../../shared/service/user-familly/user-familly.service';


@Component({
  templateUrl: 'familly.component.html',
  styleUrls: ['./familly.component.scss']
})

export class FamillyComponent implements OnInit {
  fieuls: {user:User,nberPack}[] = [];
  waitData=true;
  constructor(private notification: NotificationService,
    private userProfil: ProfilService,
    private eventService:EventService
    ) {
  }

  ngOnInit() {
    this.eventService.syncFamilyEvent.subscribe((sync:boolean)=>{
      if(sync) this.getPacksFamilly();
    })
  }

  getPacksFamilly() {
    this.userProfil.getFieulList()
    .then((result:ResultStatut)=>{
      this.fieuls=result.result;
      this.waitData=false;
    })
    .catch((error)=>{
      this.waitData=false;
    })
  }

  showNotification(from, align, colortype, icon, text) {
    this.notification.showNotification(from, align, colortype, icon, text);
  }
}
