import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { User } from '../../entity/user';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user/user.service';
import { UserLocalStorageData, UserlocalstorageService } from '../localstorage/userlocalstorage.service';
import { EventService } from '../event/event.service';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})

export class AuthentificationService {
  userData: any;

  constructor(
    public fireStorage: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private toastr: ToastrService,
    private user: UserService,
    public router: Router,
    private notificationService: NotificationService,
    private eventService: EventService,
    private localStorageService: UserlocalstorageService,
    public ngZone: NgZone) {
    this.localStorageService.dataUser.subscribe((userData: UserLocalStorageData) => {
      // this.isLoggedIn = userData.isLoggedIn;
    });
    this.userData = this.angularFireAuth.authState;

    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  /* Sign up */
  signUp(email: string, password: string): any {
    this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        return res;
      })
      .catch(err => {
        return err;
      });
  }

  /* Sign in */
  signIn(email: string, password: string): any {
    this.angularFireAuth.auth.signInWithEmailAndPassword(email, password)
      .then(res => {
        return res;
      })
      .catch(err => {
        return err;
      });
  }

  /* Sign out */
  signOut() {
    this.eventService.logoutEvent.next(true);
    this.localStorageService.clearData();
    this.angularFireAuth.auth.signOut();
    this.toastr.success('You have been successfully logged out!');
    this.router.navigate(['login']);
    this.notificationService.showNotification('top', 'right', 'success', '', '\<b>You\'re logged out !\</b>');

  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.angularFireAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.angularFireAuth.auth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.angularFireAuth.auth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['/dashboard']);
        })
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error);
      });
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.fireStorage.doc(`users/${user.uid}`);
    // const userData: User = {
    //   uid: user.uid,
    //   email: user.email,
    //   name: user.name,
    //   phone: user.phone,
    //   nicNumber: user.name,
    //   status: user.photoURL,
    //   country: user.country,
    //   city: user.city,
    //   sponsorshipId: user.sponsorshipId,
    //   emailVerified: user.emailVerified
    // }
    let userData: User = new User();
    userData.hydrate(user);
    return userRef.set(userData, {
      merge: true
    });
  }

  // Sign out 
  SignOut() {
    return this.angularFireAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }

}
