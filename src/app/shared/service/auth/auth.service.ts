import { Injectable, ɵConsole } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api/api.service';
import { UserService } from '../user/user.service';
import { Provider, User } from '../../entity/provider';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserLocalStorageData, UserlocalstorageService } from '../localstorage/userlocalstorage.service';
import * as EventEmitter from 'events';
import { EventService } from '../event/event.service';
import { NotificationService } from '../notification/notification.service';


declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: Provider = new Provider();
  currentUserSubject: BehaviorSubject<Provider> = new BehaviorSubject<Provider>(this.currentUser);
  isLoggedIn = false;

  constructor(
    // private firebaseAuth: AngularFireAuth,
    private router: Router,
    private api: ApiService,
    private toastr: ToastrService,
    private user: UserService,
    private localStorageService:UserlocalstorageService,
    private eventService:EventService,
    private notificationService: NotificationService
  ) {

    // this.registResult = false;
    // this.loginResult = false;
    this.localStorageService.dataUser.subscribe((userData: UserLocalStorageData) => {
      this.isLoggedIn = userData.isLoggedIn;
      this.currentUser = userData.user;
      this.emitCurrentUser();
    });

  }


  // resetPassword is used to reset your password.
  resetPassword() {
    this.toastr.success('Email Sent');
    this.router.navigate(['/login']);
  }

  resetDataUser(user:Provider)
  {
    this.localStorageService.setUserData({
      isLoggedIn:this.isLoggedIn,
      user
    })
  }

  emitCurrentUser()
  {
    this.currentUserSubject.next(this.currentUser);
  }

  // logOut function is used to sign out .
  logOut() {
    this.eventService.logoutEvent.next(true);
    // this.eventService.loginEvent.next(false);
    this.localStorageService.clearData();    
    setTimeout(() => {
      this.toastr.success('You have been successfully logged out!');
      this.router.navigate(['login']);
      this.notificationService.showNotification('top', 'right', 'success', '', '\<b>You\'re logged out !\</b>'); 

    }, 2000);
  }

  // Create an account on the drupal platform
  createAccount(data: User): Promise<any> {

    return new Promise((resolve, reject) => {

      const headers = {
        'Content-Type': 'application/json',
        // 'X-CSRF-Token': '97dKe-0-qukVOMY1YNBhsZ-POfPUArpL11YLfRJFD94',
        // 'Accept': 'application/json'
      };

      this.api.post('auth/requester', data.toString(), headers)
        .subscribe((response: any) => {
          if (response) {
            if (response.resultCode === 0) {
              resolve(response);
              return;
            }
            reject(response);
            return 0;
          }
        }, (error: any) => {
          if (error) {
            this.toastr.error(error.message);
            // console.log('Error message: ', error.message);
            reject(error);
          }
        });
    });

  }


  // Login into your account
  authLogin(email?: string, password?: string): Promise<any> {
    const param = {
      'email': email,
      'password': password,
    };
    const header = {
      'Content-Type': 'application/json',
      // 'Accept': 'application/json'
    };

    return new Promise((resolve, reject) => {
      this.api.post('auth/login', param, header)
        .subscribe(response => {
         if(response.resultCode==0)
         {
          let token:any=jwt_decode(response.result.token)
          this.api.setAccessToken(response.result.token);        
          this.user.getUserById(token.id)
          .then((data) => {
              this.localStorageService.setUserData({
                isLoggedIn:true,
                user:data
              });             
              this.router.navigate(['dashboard']);
              this.toastr.success('You have been successfully logged In!');
              this.eventService.loginEvent.next(true);
              resolve(response);
          });
         }
         else
         {
          reject(response)
         }
        }, error => {
          this.toastr.success('You have failed to logged In!');
          reject(error);

          if (error && error.error === 'invalid_grant') {
            this.toastr.success('Invalid credentials ! Please check your informations and try again.');
          }

        });
    });
  }

  showNotification(from, align, colortype, icon, text) {

    $.notify({
        icon: icon,
        message: text
    }, {
        type: colortype,
        timer: 2000,
        placement: {
            from: from,
            align: align
        }
    });
}

}
