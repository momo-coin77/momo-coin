import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TimepickerComponent } from 'ngx-bootstrap/timepicker';
import { Market, MarketOpenTime } from '../../../../shared/entity/market';
import { ConfigAppService } from '../../../../shared/service/config-app/config-app.service';
import { ResultStatut } from '../../../../shared/service/firebase/resultstatut';
import { NotificationService } from '../../../../shared/service/notification/notification.service';

@Component({
  selector: 'app-settings-admin',
  templateUrl: './settings-admin.component.html',
  styleUrls: ['./settings-admin.component.css']
})
export class SettingsAdminComponent implements OnInit, AfterViewInit {
  market:Market=new Market();
  waitForChangeStateMarket:boolean=false;
  timeList:MarketOpenTime[]=[];
  @ViewChild("timepicker") timePicker:TimepickerComponent;

  constructor(private configAppService:ConfigAppService,
    private notificationService:NotificationService) { 
    
  }
 
  ngOnInit(): void {
    this.configAppService.market.subscribe((market:Market)=>{
      this.market=market;
      this.timeList=market.openTime.slice();
    })
  }
  ngAfterViewInit(): void {
    // this.timePicker.
  }

  changeMarketStatus()
  {
    this.waitForChangeStateMarket=true;
    this.configAppService.switchMarketState()
    .then((result:ResultStatut)=>{
      this.waitForChangeStateMarket=false;
      this.notificationService.showNotificationWithoutTimer('top', 'center', 'success', 'pe-7s-close-circle', '\<b>Success !\</b>\<br>The status of the market has been changed successfully ');
    })
    .catch((error)=>{
      this.waitForChangeStateMarket=false;
      this.notificationService.showNotificationWithoutTimer('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>'+error.message);
    })
  }


}
