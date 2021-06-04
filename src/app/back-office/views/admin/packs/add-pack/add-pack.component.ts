import { Component, OnInit } from '@angular/core';
import { PackService } from '../../../../../shared/service/pack/pack.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Pack, PackState } from '../../../../../shared/entity/pack';
import { UserService } from '../../../../../shared/service/user/user.service';
import { EntityID } from '../../../../../shared/entity/EntityID';
import { ResultStatut } from '../../../../../shared/service/firebase/resultstatut';
import { BasicPackService } from '../../../../../shared/service/pack/basic-pack.service';
import { NotificationService } from '../../../../../shared/service/notification/notification.service';
import { ValidatorinputService } from '../../../../../shared/service/validatorinput/validatorinput.service';
// import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-pack',
  templateUrl: './add-pack.component.html',
  styleUrls: ['./add-pack.component.scss']
})
export class AddPackComponent implements OnInit {

  form:FormGroup;
  submitted:boolean=false;
  packStates: {text:String,value:PackState}[]=[
    {text:"Sur le marché",value:PackState.ON_MARKET},
    {text:"Pas sur le marché" , value:PackState.NOT_ON_MARKET}
  ]; 

  waitResponse:boolean=false;

  constructor(
    private packService: BasicPackService,
    private userService:UserService,
    private notificationService:NotificationService,
    private validatorInput:ValidatorinputService,
    private router: Router) { }

  ngOnInit() {
    this.form=new FormGroup({
      amount:new FormControl("",[Validators.required]),
      packState:new FormControl(this.packStates[0].value),
      saleDate:new FormControl(""),
      idOwner:new FormControl("",[Validators.required,Validators.minLength(20)]),
    });
  }

  addPack() {//
    this.submitted=true;
    if(this.form.invalid) return;
    if(this.validatorInput.numberSanitize(this.form.value.amount))
    {
      this.form.controls.amount.markAsDirty();
    }
    this.waitResponse=true;
    this.userService.getListUser()
    let idOwner:EntityID=new EntityID();
    idOwner.setId(this.form.value.idOwner);
    
    
    this.userService.getUserById(idOwner)
    .then((result:ResultStatut)=>{
      let pack:Pack=new Pack();
      pack.amount=+this.form.value.amount;
      pack.state=this.form.value.packState;
      pack.saleDate=this.form.value.saleDate;
      pack.idBuyer.setId(" ");
      pack.idOwner=idOwner;
      return this.packService.addPack(pack)
    })
    .then((result)=> {
      this.waitResponse=false;
      this.notificationService.showNotificationWithoutTimer('top', 'center', 'success', 'pe-7s-close-circle', '\<b>Success !\</b>\<br>The pack has been successfully added to the list of packs for this user');
      this.form.reset();
      this.submitted=false;
    })
    .catch((error:ResultStatut)=>{
      this.waitResponse=false;
      this.notificationService.showNotificationWithoutTimer('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>'+error.message);
      
    })
      
    
  }
}
