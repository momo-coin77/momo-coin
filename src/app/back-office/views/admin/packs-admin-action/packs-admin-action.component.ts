import { Component, Input, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Pack } from '../../../../shared/entity/pack';
import { DataStateUpdateService } from '../../../../shared/service/data-state-update/data-state-update.service';
import { ResultStatut } from '../../../../shared/service/firebase/resultstatut';
import { MarketService } from '../../../../shared/service/market/market.service';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { BasicPackService } from '../../../../shared/service/pack/basic-pack.service';
import { UserService } from '../../../../shared/service/user/user.service';
import { SplitAdminPackComponent } from '../split-admin-pack/split-admin-pack.component';
import { UserTransferPackComponent } from '../user-transfer-pack/user-transfer-pack.component';

@Component({
  selector: 'app-packs-admin-action',
  templateUrl: './packs-admin-action.component.html',
  styleUrls: ['./packs-admin-action.component.css']
})
export class PacksAdminActionComponent implements OnInit {
  @Input() pack:Pack=new Pack();
  selectedPackId:String="";

  waitResponse:boolean=false
  waitResponseSecond:boolean=false;
  waitResponseThird:boolean=false;
  waitResponseFour:boolean=false;

  constructor(
    private basicPackService:BasicPackService,    
    private marketService:MarketService,
    private userService:UserService,
    private notificationService:NotificationService,
    private dataUpdateService:DataStateUpdateService,
    private dialog:BsModalService
  ) { }

  ngOnInit(): void {
  }

  changeStatusPack(pack:Pack)
  {
    if(this.waitResponse || this.waitResponseSecond || this.waitResponseThird || this.waitResponseFour) return;
    this.waitResponse=true;
    this.selectedPackId=pack.id.toString()
    // console.log(pack)
    this.basicPackService.changeStatusMarket(pack)
    .then((result:ResultStatut)=>{
      this.waitResponse=false
      this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', `\<b>Success !\</b>\<br>The status of the pack is now '${pack.state}'`,200); 
      this.selectedPackId=""
    })
    .catch((error:ResultStatut)=>{
      this.waitResponse=false
      this.selectedPackId="";
      this.notificationService.showNotificationWithoutTimer('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Error !\</b>\<br>'+error.message);
    })
  }

  deletePack(pack:Pack)
  {
    if(this.waitResponse || this.waitResponseSecond || this.waitResponseThird || this.waitResponseFour) return;
    this.waitResponseSecond=true;
    this.selectedPackId=pack.id.toString();
    this.basicPackService.deletePack(pack)
    .then((result:ResultStatut)=>{
      this.selectedPackId="";
      this.waitResponseSecond=false;
      this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', `\<b>Success !\</b>\<br> The pack has been deleted successfully `,200); 
    })
    .catch((error:ResultStatut)=>{
      this.waitResponseSecond=false
      this.selectedPackId="";
      this.notificationService.showNotificationWithoutTimer('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Error !\</b>\<br>'+error.message);
    })
  }

  transferPack(pack:Pack)
  {
    if(this.waitResponse || this.waitResponseSecond || this.waitResponseThird || this.waitResponseFour) return;
    this.waitResponseThird=true;
    this.selectedPackId=pack.id.toString();
    this.userService.getUserById(pack.idOwner)
    .then((result:ResultStatut)=>{
      this.selectedPackId="";
      this.waitResponseThird=false;
      this.dialog.show(UserTransferPackComponent,
        {
          initialState:{
            user:result.result,
            pack
          }
        }
      );
    })
    .catch((error:ResultStatut)=>{
      this.selectedPackId="";
      this.waitResponseThird=false;
      this.notificationService.showNotificationWithoutTimer('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Error !\</b>\<br>'+error.message);
    })
    
  }

  splitPack(pack:Pack)
  {
    if(this.waitResponse || this.waitResponseSecond || this.waitResponseThird || this.waitResponseFour) return;
    this.waitResponseFour=true;
    this.selectedPackId=pack.id.toString();
    this.userService.getUserById(pack.idOwner)
    .then((result:ResultStatut)=>{
      this.selectedPackId="";
      this.waitResponseFour=false;
      this.dialog.show(SplitAdminPackComponent,
        {
          initialState:{
            user:result.result,
            pack
          }
        }
      );
    })
    .catch((error:ResultStatut)=>{
      this.selectedPackId="";
      this.waitResponseFour=false;
      this.notificationService.showNotificationWithoutTimer('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Error !\</b>\<br>'+error.message);

    })
  }

}
