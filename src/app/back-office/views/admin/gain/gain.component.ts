import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ConfigAppService } from '../../../../shared/service/config-app/config-app.service';
import { ResultStatut } from '../../../../shared/service/firebase/resultstatut';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { AdminTimerpickerComponent } from '../admin-timerpicker/admin-timerpicker.component';
import { GainInputComponent } from '../gain-input/gain-input.component';

@Component({
  selector: 'app-gain',
  templateUrl: './gain.component.html',
  styleUrls: ['./gain.component.css']
})
export class GainComponent implements OnInit {

  waitForChangeStateGain:boolean=false;
  gainList:{percent:string,numberOfDay:number}[]=[]
  waitLoadData=true;
  @ViewChildren(GainInputComponent) gains:QueryList<GainInputComponent>;
  constructor(
    private configAppService:ConfigAppService,
    private notificationService:NotificationService
  ) { }

  ngOnInit(): void {
    this.configAppService.gains.subscribe((gains:{percent:string,numberOfDay:number}[])=>{
      this.gainList=gains;
      if(this.gainList.length>0) this.waitLoadData=false
    })
  }
  addGain()
  {
    this.gainList.push({percent:"0",numberOfDay:0})
  }
  removeGain()
  {
    this.gainList.splice(this.gainList.length-1)   
  }
  saveGain()
  {
    let tlist:GainInputComponent[]=this.gains.toArray();
    let ngList:{percent:string,numberOfDay:number}[]=[]
    for (let i=0;i<tlist.length; i+=2)
    {
      let nberOfDay=parseInt(tlist[i].getValue())
      let percent=parseInt(tlist[i+1].getValue())
      
      if(percent<=0) 
      {
        this.notificationService.showNotificationWithoutTimer('top', 'center', 'danger', 'pe-7s-close-circle', `\<b>Error !\</b>\<br>The percentage of row N°${(i/2)+1} is invalid`);
        return;
      }
      if(nberOfDay<=0) 
      {
        this.notificationService.showNotificationWithoutTimer('top', 'center', 'danger', 'pe-7s-close-circle', `\<b>Error !\</b>\<br>The number of days of row N°${(i/2)+1} is invalid`);
        return;
      }      
      ngList.push({
        percent:`${percent}`,
        numberOfDay:nberOfDay
      })
    }
    if(this.waitForChangeStateGain) return;
    this.waitForChangeStateGain=true;
    this.configAppService.saveGain(ngList)
    .then((result:ResultStatut)=>{
      this.waitForChangeStateGain=false;
      this.notificationService.showNotificationWithoutTimer('top', 'center', 'success', 'pe-7s-close-circle', `\<b>Success !\</b>\<br>The earnings have been successfully updated`);
    })
    .catch((result:ResultStatut)=>{
      this.waitForChangeStateGain=false;
      this.notificationService.showNotificationWithoutTimer('top', 'center', 'danger', 'pe-7s-close-circle', `\<b>Error !\</b>\<br>`+result.message);
    })
    // console.log("Gain",ngList)
  }
}
