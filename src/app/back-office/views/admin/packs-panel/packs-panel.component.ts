import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { merge } from 'rxjs';
import { EntityID } from '../../../../shared/entity/EntityID';
import { Pack } from '../../../../shared/entity/pack';
import { DataStateUpdateService } from '../../../../shared/service/data-state-update/data-state-update.service';
import { ResultStatut } from '../../../../shared/service/firebase/resultstatut';
import { MarketService } from '../../../../shared/service/market/market.service';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { BasicPackService } from '../../../../shared/service/pack/basic-pack.service';
import { UserService } from '../../../../shared/service/user/user.service';
import { UserTransferPackComponent } from '../user-transfer-pack/user-transfer-pack.component';

@Component({
  selector: 'app-packs-panel',
  templateUrl: './packs-panel.component.html',
  styleUrls: ['./packs-panel.component.css']
})
export class PacksPanelComponent implements OnInit {
  listAllPack:Pack[]=[];
  listAllPackCheck:Map<string,boolean>=new Map<string,boolean>();

  listOnMarketPack:Pack[]=[];
  listOnMarketPackCheck:Map<string,boolean>=new Map<string,boolean>();

  listNotOnMarketPack:Pack[]=[];
  listNotOnMarketPackCheck:Map<string,boolean>=new Map<string,boolean>();

  

  waitResponseSecondBtn:boolean=false;
  waitResponseBtn:boolean=false

  

  selectedPackId:String="";
  constructor(
    private marketService:MarketService,
    private userService:UserService,
    private notificationService:NotificationService,
    private basicPackService:BasicPackService,
    private dataUpdateService:DataStateUpdateService,
    private dialog:BsModalService
  ) { }

  ngOnInit(): void {
    this.marketService.getAllPackInMarket().subscribe((pack:Pack)=>{
      if (!this.listOnMarketPackCheck.has(pack.id.toString().toString())) {
        this.listOnMarketPackCheck.set(pack.id.toString().toString(), true);
        this.listOnMarketPack.push(pack);
      }
    })

    this.marketService.getAllPackNotInMarket().subscribe((pack:Pack)=>{
      if (!this.listNotOnMarketPackCheck.has(pack.id.toString().toString())) {
        this.listNotOnMarketPackCheck.set(pack.id.toString().toString(), true);
        this.listNotOnMarketPack.push(pack);
      }
    })

    merge(this.marketService.getAllPackInMarket(),this.marketService.getAllPackNotInMarket())
    .subscribe((pack:Pack)=>{
      if (!this.listAllPackCheck.has(pack.id.toString().toString())) {
        this.listAllPackCheck.set(pack.id.toString().toString(), true);
        this.listAllPack.push(pack);
      }
    })
  }
  getFormatDate(date:string):string
  {
    return new Date(date).toLocaleDateString()
  }
  getFormatHours(date:string):string
  {
    if(date=="") return date;
    let stringDate="";
    try
    {
      let d=new Date(date)
      if(d.getHours()<10) stringDate=`0${d.getHours()}H:`;
      else stringDate=`${d.getHours()}H:`;

      if(d.getMinutes()<10) stringDate+=`0${d.getMinutes()} Min`;
      else stringDate+=`${d.getMinutes()} Min`;
    }
    catch(err)
    {
      console.log(err)
    }
    
    return stringDate;
  }
  getBuyer(id:EntityID)
  {
    if(this.userService.listUser.has(id.toString())) return this.userService.listUser.get(id.toString()).email
    return ""
  }
  emptyMarket()
  {
    if(this.waitResponseBtn || this.waitResponseSecondBtn) return;
    this.waitResponseBtn=true;
    this.marketService.putAllNoToMarket()
    .then((result:ResultStatut)=>{
      this.waitResponseBtn=false
      this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', '\<b>Success !\</b>\<br>The market was successfully emptied',200);
    })
    .catch((error:ResultStatut)=>{
      this.waitResponseBtn=false
      this.notificationService.showNotificationWithoutTimer('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Error !\</b>\<br>'+error.message);
    })
  }
  
  checkPackList()
  {
    if(this.waitResponseBtn || this.waitResponseSecondBtn) return;
    this.waitResponseSecondBtn=true;
    this.dataUpdateService.clearAndCheckDateBasePack()
    .then((result:ResultStatut)=>{
      this.waitResponseSecondBtn=false;
      this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', `\<b>Success !\</b>\<br> The market has been updated successfully `,200)
    })
    .catch((error:ResultStatut)=>{
      this.waitResponseSecondBtn=false
      this.notificationService.showNotificationWithoutTimer('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Error !\</b>\<br>'+error.message);
    })    
  }
  

}
