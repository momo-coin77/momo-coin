import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/service/user/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/service/auth/auth.service';
import { Provider, ServiceOfProvider, User } from '../../../shared/entity/provider';
import { ProviderService } from '../../../shared/service/back-office/provider.service';
import { NotificationService } from '../../../shared/service/notification/notification.service';
// import { AuthService } from 'app/shared/services/auth.service';
// import { UserService } from 'app/shared/services/user.service';
// import { User } from 'app/shared/services/user';

declare var $: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  updateProfilForm: FormGroup;
  submitted: boolean = false;
  // user: any[];
  // users: any[];
  user:Provider= new Provider();
  userService:ServiceOfProvider=new ServiceOfProvider();
  userEmail: String = "";
  firstName: String ="";
  lastName: String = "";
  name = "";
  userAddress = '';
  userCity: String = '';
  userCountry: String = '';
  userZip = '';
  userPhone: String = '';
  // userCoverImg: string = 'assets/img/userCoverImg1.png';
  userProfileImg: string = '../../../../assets/img/user_image.png';
  userName: String = '';
  aboutUser: String = '';
  isProvider: boolean = false;
  // this.userData.getUserInformations().isProvider;

  carrierDatas: string = "Not avilable";

  message: string = '\<b>Error\</b>\<br>Someone was not going. This option is not available.';

  constructor(
    private formBuilder: FormBuilder,
    // private userService: UserService,
    // public authService: AuthService,
    private userData: UserService,
    private authService:AuthService,
    private providerService:ProviderService,
    public router: Router,
    public ngZone: NgZone,
    private notification: NotificationService) {

    // this.user["name"] = `${this.userService.user.firstName} ${this.userService.user.lastName}`;

  }

  ngOnInit() {

    this.authService.currentUserSubject.subscribe((user: Provider) => {
      this.userEmail = user.adresse.email;
      this.firstName = user.firstname;
      this.lastName = user.lastname;
      this.name = user.getSimpleName().toString();
      this.userAddress = '';
      this.userCity = user.adresse.city;
      this.userCountry = user.adresse.country;
      this.userZip = '';
      this.userPhone = user.adresse.phone;
      this.userName = user.username;
      this.aboutUser = '';
      this.isProvider = user.isProvider.valueOf();
      this.user=user;
    })
    this.providerService.currentServiceOfProvider.subscribe((service:ServiceOfProvider)=>{
      this.userService=service;
    })
    


    // console.log(this.userData.getUserInformations().field_firstname);
    // this.users = [this.userService.user];
    this.updateProfilForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      userAddress: ['', Validators.required],
      userCity: ['', Validators.required],
      userCountry: ['', Validators.required],
      userZip: ['', Validators.required],
      userPhone: ['', Validators.required],
      userName: ['', Validators.required],
      aboutUser: ['', Validators.required],
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.updateProfilForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.updateProfilForm.invalid) {
      return;
    }
    this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry\</b>\<br>This service was not available now. Tray later.');
  }
}
