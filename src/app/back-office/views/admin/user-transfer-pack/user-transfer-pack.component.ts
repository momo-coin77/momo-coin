import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Message } from '../../../../shared/entity/chat';
import { Pack, PackBuyState } from '../../../../shared/entity/pack';
import { User } from '../../../../shared/entity/user';
import { ConfigAppService } from '../../../../shared/service/config-app/config-app.service';
import { ResultStatut } from '../../../../shared/service/firebase/resultstatut';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { PlanService } from '../../../../shared/service/opperations/plan.service';
import { BasicPackService } from '../../../../shared/service/pack/basic-pack.service';

@Component({
  selector: 'app-user-transfer-pack',
  templateUrl: './user-transfer-pack.component.html',
  styleUrls: ['./user-transfer-pack.component.css']
})
export class UserTransferPackComponent implements OnInit {
  // gainList = Object.keys(gainConfig).map((key) => Object.create({}, { value: { value: gainConfig[key] }, key: { value: key } }));
  gainList:{percent:string,numberOfDay:number}[]=[] 
  @Input() user:User;
  @Input() pack:Pack;
  waitResponse:boolean=false;
  emailForSearchUser:string=""
  selectedUser:User=null;
  submitted:boolean=false;
  form:FormGroup;

  constructor(
    private bsModalRef: BsModalRef,
    private packService:BasicPackService,
    private planService:PlanService,
    private notificationService:NotificationService,
    private configAppService:ConfigAppService
    ) { }

  ngOnInit(): void {
    //this.gainList.length>0?new FormControl(this.gainList[0].numberOfDay):new FormControl()
    this.configAppService.gains.subscribe((gain:{percent:string,numberOfDay:number}[])=>{
      this.gainList=gain;
    })

    this.form=new FormGroup({
      payDate:new FormControl("",[Validators.required]),
      plan: this.gainList.length>0?new FormControl(this.gainList[0].numberOfDay):new FormControl()
    });
  }
  setSelectedUser(user:User)
  {
    this.selectedUser=user;
  }
  selectedEmailUser(email)
  {
    this.emailForSearchUser=email;
  }
  close() {
    this.bsModalRef.hide();
  }
  confirm()
  {
    this.submitted=true;
    // console.log(this.form.valid,this.selectedUser)
    if(!this.form.valid) return;
    if(this.selectedUser==null) return;
    this.waitResponse=true;
    this.pack.idBuyer.setId(this.selectedUser.id.toString())

    let waintedGain = this.gainList.find((value)=>value.percent==this.form.value.plan)
    // console.log("WaintedGain ",waintedGain)
    this.pack.wantedGain.jour=waintedGain.numberOfDay;
    this.pack.wantedGain.pourcent=+waintedGain.percent;
    this.pack.nextAmount = this.planService.calculePlan(this.pack.amount,this.pack.wantedGain.jour);
    this.pack.saleDate=this.form.value.payDate;

    let message:Message=new Message();
    message.from.setId(this.selectedUser.id.toString());
    message.to.setId(this.user.id.toString());
    message.idPack.setId(this.pack.id.toString());
    this.pack.buyState=PackBuyState.ON_WAITING_SELLER_CONFIRMATION_PAIEMENT
    // console.log(this.pack,message)
    this.packService.confirmPaiementBySeller(this.pack,message,this.selectedUser,false)
    .then((result:ResultStatut)=>{
      this.waitResponse=false;
      this.form.reset();
      this.submitted=false;
      this.close();
      setTimeout(() => {
        this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', '\<b>Success !\</b>\<br>The pack has been successfully added to the list of packs for this user',200);
      }, 200);
    })
    .catch((error:ResultStatut)=>{
      this.waitResponse=false;
      this.submitted=false;
      this.close();
      setTimeout(()=>{
        this.notificationService.showNotificationWithoutTimer('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>'+error.message);
        },
      200)   
    })
  }
}
