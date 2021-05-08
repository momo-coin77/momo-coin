import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ModalModule } from 'angular-bootstrap-md';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ColisPackage, Package } from '../../entity/package';
import { Provider } from '../../entity/provider';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})

export class DetailComponent implements OnInit {
  passenger: boolean;
  parcel: boolean;
  confirmPayment: boolean;
  waitPayment: boolean;
  transport: boolean;
  confirmTransport: boolean;
  @ViewChild("myModal") modal;
  //////////   Parcel Detail //////////
  isAnsware: boolean = false;

  // Parcel datas
  parcelName = 'Phone Samsung galxy S10';
  startLocation = 'Bangangté';
  endLocation = 'Yaoundé';
  parcelType = 'Small';
  vehiculType = 'Buss';
  volume:Number = 0;
  isFragile = true;
  isUrgent = false;

  // collectionDate: Date;
  collectionDate = '2021/12/12';
  description = 'This the description of my parcel';
  price = 5000;

  // Receiver datas
  receiverName = 'Cédric NGUENDAP';
  receiverLocation = 'Yaoundé';
  receiverPhone = '+237 244 521 451';

  // Sender datas
  senderName = 'Flambel SANOU';
  senderLocation = 'Bangangté';
  senderPhone = '+237 691 2247 472';

  /////-- --- --- ---- --- --- --/////////


  //////////   Passenger Detail //////////

  // passenger datas
  passengerName = 'SANOU KUE Flambel Junior';
  // startLocation = 'Bangangté';
  // endLocation = 'Yaoundé';
  nuberOfPlace = 4;
  // isUrgent = false;
  // collectionDate = '2021/12/12';
  passengerDescription = 'This the description of passenger profil';
  // price = 5000;

  // passenger more detail
  passengerEmail = 'passenger@email.com';
  passengerLocation = 'Bangangté';
  passengerPhone = '+237 691 2247 472';



  constructor(public router: Router, private userService:UserService) {
    this.passenger = false;
    this.parcel = false;
    this.confirmPayment = false;
    this.waitPayment = false;
    this.transport = false;
    this.confirmTransport = false;
  }
  ngOnInit(): void {
    this.passenger = true;
  }

  show(pkg:ColisPackage)
  {
    this.parcelName=pkg.package_name.toString();
    this.startLocation=pkg.from.city.toString();
    this.endLocation = pkg.to.city.toString();
    this.parcelType = pkg.typeof.toString();
    this.vehiculType = pkg.carTypeList[0].getStringVehicle();
    this.volume = pkg.size_depth.valueOf()*pkg.size_heigth.valueOf()*pkg.size_piece_length.valueOf();
    this.isFragile = pkg.is_weak.valueOf();
    this.isUrgent = pkg.is_urgent.valueOf();

    // collectionDate: Date;
    this.collectionDate = pkg.date_arrival.toString();
    this.description = pkg.description.toString();
    this.price = pkg.suggestedPrice;

    // Receiver datas
    this.receiverName = pkg.receiver.name.toString();
    this.receiverLocation = pkg.to.city.toString();
    this.receiverPhone = pkg.receiver.contact.toString();

    // Sender datas
    this.userService.getUserById(pkg.idRequester)
    .then((requester:Provider)=>{
      this.senderName=requester.getSimpleName().toString();
      this.senderLocation=requester.adresse.city.toString();
      this.senderPhone=requester.adresse.mobilePhone.toString();
    })
    this.modal.show();
  }
}
