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
  name: String = '';
  email: String = '';
  network: String = '';
  phone: string = '';
  country: String = '';
  city: String = '';
  message: string = '\<b>Error\</b>\<br>this action not permited!';
  id: String;

  constructor(
    private authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    public notif: NotificationService) {

  }
  copyMessage(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  ngOnInit() {

    this.authService.currentUserSubject.subscribe((user: User) => {
      this.name = user.name;
      this.email = user.email;
      this.network = user.network;
      this.phone = user.phone;
      this.id = this.authService.currentUserSubject.getValue().id.toString()
      this.country = user.country;
      this.city = user.city;
    });
  }
  idCopied(){
    this.notif.showNotification('bottom', 'center', 'secondary', 'fa fa-check', '  Id copied');

  }
}
