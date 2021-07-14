import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EntityID } from '../../../../shared/entity/EntityID';
import { Pack, PackState } from '../../../../shared/entity/pack';
import { User } from '../../../../shared/entity/user';
import { ConfigAppService } from '../../../../shared/service/config-app/config-app.service';
import { ResultStatut } from '../../../../shared/service/firebase/resultstatut';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { PlanService } from '../../../../shared/service/opperations/plan.service';
import { BasicPackService } from '../../../../shared/service/pack/basic-pack.service';
import { UserService } from '../../../../shared/service/user/user.service';
import { ValidatorinputService } from '../../../../shared/service/validatorinput/validatorinput.service';

@Component({
  selector: 'app-user-add-pack',
  templateUrl: './user-add-pack.component.html',
  styleUrls: ['./user-add-pack.component.css']
})
export class UserAddPackComponent implements OnInit {
  @Input() user:User;
  form:FormGroup;
  submitted:boolean=false;
  packStates: {text:String,value:PackState}[]=[
    {text:"Sur le marché",value:PackState.ON_MARKET},
    {text:"Pas sur le marché" , value:PackState.NOT_ON_MARKET}
  ]; 
  waitResponse:boolean=false;
  // gainList = Object.keys(gainConfig).map((key) => Object.create({}, { value: { value: gainConfig[key] }, key: { value: key } }));
  gainList:{percent:string,numberOfDay:number}[]=[] 
  constructor(
    private bsModalRef: BsModalRef,
    private packService: BasicPackService,
    private notificationService:NotificationService,
    private userService:UserService,
    private planService:PlanService,
    private validatorInput:ValidatorinputService,
    private configAppService:ConfigAppService

    // public dialogRef: MatDialogRef<UserAddPackComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }
  close() {
    this.bsModalRef.hide();
  }
  ngOnInit(): void {
    this.configAppService.gains.subscribe((gain:{percent:string,numberOfDay:number}[])=>{
      this.gainList=gain;
    })

    this.form=new FormGroup({
      amount:new FormControl("",[Validators.required]),
      payDate:new FormControl(""),
      plan: this.gainList.length>0?new FormControl(this.gainList[0].numberOfDay):new FormControl()

    });
  }
  confirm()
  {
    this.submitted=true;
    if(this.form.invalid) return;
    if(this.validatorInput.numberSanitize(this.form.value.amount))
    {
      this.form.controls.amount.markAsDirty();
    }
    this.waitResponse=true;
    
    let pack:Pack=new Pack();
    let waintedGain = this.gainList.find((value)=>value.percent==this.form.value.plan)
    // console.log("WaintedGain ",waintedGain)

    pack.amount=+this.form.value.amount;
    pack.plan=+waintedGain.numberOfDay;
    pack.amount=this.planService.calculePlan(pack.amount,pack.plan);

    let date: Date = new Date(this.form.value.payDate);
    date.setDate(date.getDate() + pack.plan);
    pack.saleDate=date.toISOString();   

    pack.payDate=this.form.value.payDate;
    pack.idBuyer.setId(" ");
    pack.idOwner.setId(this.user.id.toString())

    this.packService.addPack(pack,this.user)
    .then((result)=> {
      this.waitResponse=false;      
      this.form.reset();
      this.submitted=false;
      this.close();
      setTimeout(() => {
        this.notificationService.showNotificationWithoutTimer('top', 'center', 'success', 'pe-7s-close-circle', '\<b>Success !\</b>\<br>The pack has been successfully added to the list of packs for this user');
      }, 200);
    })
    .catch((error:ResultStatut)=>{
      this.waitResponse=false;
      setTimeout(()=>{
        this.notificationService.showNotificationWithoutTimer('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>'+error.message);
        },
      200)      
    })
  }
}
