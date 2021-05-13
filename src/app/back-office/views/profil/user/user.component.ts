import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../shared/entity/user';
import { AuthService } from '../../../../shared/service/auth/auth.service';

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

  constructor(
    private authService: AuthService,
    public router: Router,
    public ngZone: NgZone) {

  }

  ngOnInit() {

    this.authService.currentUserSubject.subscribe((user: User) => {
      this.name = user.name;
      this.email = user.email;
      this.network = user.network;
      this.phone = user.phone;
      this.country = user.country;
      this.city = user.city;
    });
  }

}
