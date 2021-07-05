import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Pack } from '../../../../shared/entity/pack';
import { User } from '../../../../shared/entity/user';
import { ResultStatut } from '../../../../shared/service/firebase/resultstatut';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { BasicPackService } from '../../../../shared/service/pack/basic-pack.service';

@Component({
  selector: 'app-split-admin-pack',
  templateUrl: './split-admin-pack.component.html',
  styleUrls: ['./split-admin-pack.component.css']
})
export class SplitAdminPackComponent implements OnInit {
  @Input() pack:Pack=new Pack()
  @Input() user:User=new User();
  nextAmount:number=0;
  reduceFormControl:FormControl;
  submitted:boolean=false;
  waitResponse:boolean=false;
  constructor(
    private bsModalRef: BsModalRef,
    private basicPackService:BasicPackService,
    private notificationService:NotificationService) { }

  ngOnInit(): void {
    this.nextAmount=this.pack.amount;
    this.reduceFormControl=new FormControl('',[Validators.required,Validators.min(1000)])
    this.reduceFormControl.valueChanges.subscribe((value)=>{
      if(!value) this.nextAmount=this.pack.amount
      else this.nextAmount=Math.round((this.pack.amount-parseInt(value))*100)/100;
    })
  }
  close() {
    this.bsModalRef.hide();
  }
  confirm()
  {
    this.submitted=true;    
    if(!this.reduceFormControl.valid) return;    
    this.waitResponse=true;
    this.basicPackService.splitPack(this.pack,this.reduceFormControl.value)
    .then((result:ResultStatut)=>{
      this.submitted=false;
      this.waitResponse=false;
      this.close();
      setTimeout(() => {
        this.notificationService.showNotificationWithoutTimer('top', 'center', 'success', 'pe-7s-close-circle', '\<b>Success !\</b>\<br>The pack has been successfully divided');
      }, 200);
      
    })
    .catch((error:ResultStatut)=>{
      this.submitted=false;
      this.waitResponse=false;
      this.close();
      setTimeout(()=>{
        this.notificationService.showNotificationWithoutTimer('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>'+error.message);
        },
      200)   
    })
  }
}
