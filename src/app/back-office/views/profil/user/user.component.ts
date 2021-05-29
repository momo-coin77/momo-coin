import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../shared/entity/user';
import { AuthService } from '../../../../shared/service/auth/auth.service';
import {DomSanitizer} from '@angular/platform-browser';
import { NotificationService } from '../../../../shared/service/notification/notification.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  updateProfilForm: FormGroup;
  user: User = new User();
  name: string = '';
  email: string = '';
  network: string = '';
  phone: string = '';
  bonus: number = 0;
  country: string = '';
  city: string = '';
  message: string = '\<b>Error\</b>\<br>this action not permited!';
  id: string;
  parentSponsorShipId: string;

  constructor(
    private authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    public notif: NotificationService) {
      this.setData();
  // console.log('parent sponsor id', this.parentSponsorShipId)

  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = 'https://2mocoin.000webhostapp.com/#/register/' + val; // a remplacer par le lien https de la page registration de MC
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  ngOnInit() {
    this.setData();
  }

  setData(){
    this.authService.currentUserSubject.subscribe((user: User) => {
      this.name = user.name;
      this.email = user.email;
      this.network = user.network;
      this.phone = user.phone;
      this.id = user.mySponsorShipId.toString().toString();
      this.country = this.authService.currentUserSubject.getValue().country;
      this.city = this.authService.currentUserSubject.getValue().city;
      this.parentSponsorShipId = this.authService.currentUserSubject.getValue().parentSponsorShipId.toString().toString();
    });
  }

  idCopied(){
    this.notif.showNotification('bottom', 'center', 'secondary', 'fa fa-check', '  Id copied');

  }
}
