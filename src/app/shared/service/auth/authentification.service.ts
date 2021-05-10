import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { User } from '../../model/user';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user/user.service';
import { UserLocalStorageData, UserlocalstorageService } from '../localstorage/userlocalstorage.service';
import { EventService } from '../event/event.service';
import { NotificationService } from '../notification/notification.service';
import { FireBaseConstant } from '../firebase/firebase-constant';
import { FetchApiService } from '../fetch-api.service';
import { ActionStatut } from '../../model/statut';
import { ManageAccountService } from '../manageAccount.service';
import { serializeData, deSerializeData, keyExist, clearDataFromStorage } from '../../utils/localStorageSerialization';

@Injectable({
  providedIn: 'root'
})

export class AuthentificationService {
  userData: any;
  user: User = null;
  isAuth: boolean = false;

  constructor(
    private manageAccount: ManageAccountService,
    private fetchApi: FetchApiService,) {
  }

  handleApiError(result: any) {
    switch (result.apiCode) {
      case FireBaseConstant.AUTH_WRONG_PASSWORD:
        result.message = 'Email ou mot de passe incorrect';
        break;
      case FireBaseConstant.AUTH_WEAK_PASSWORD:
        result.message = 'Mot de passe doit avoir au moins 6 carracteres';
        break;
      case FireBaseConstant.AUTH_EMAIL_ALREADY_USE:
        result.message = 'Email déjà utiliser par un autre utilisateur';
        break;
      case FireBaseConstant.NET_NETWORK_FAIL:
        result.message = 'Hors connexion. Veuillez verifier votre connectivité réseau';
        break;
    }
  }

  /* Sign up */
  signUp(user: User): Promise<ActionStatut> {
    return new Promise<ActionStatut>((resolve, reject) => {
      this.manageAccount.createAccount(user)
        .then((result) => {
          return this.signIn(user, false);
        })
        .then((result) => {
          this.user = User.fromObject({
            email: user.email,
            name: user.name,
            id: this.fetchApi.user.uid,
            disponibilite: {}
          });
          return this.manageAccount.saveAccount(this.user)
        })
        .then((e) => {
          this.isAuth = true;
          return this.manageAccount.getUsersFromApi();
        })
        .then((result) => {
          // this.setUserDataToStorage();
          resolve(result);
        })
        .catch(e => {
          this.handleApiError(e);
          reject(e)
        })
    });
  }

  /* Sign in */
  signIn(userN: User, shouldGetUserData: boolean = true): Promise<ActionStatut> {
    let action = new ActionStatut();
    return new Promise<ActionStatut>((resolve, reject) => {
      this.fetchApi.signInApi(userN.email, userN.password)
        .then(result => {
          this.isAuth = true;
          action = result;
          if (shouldGetUserData) { return this.manageAccount.getUsersFromApi(); }
        })
        .then((result) => {
          this.user = this.manageAccount.findByEmail(userN.email);
          // console.log(this.user);
          // this.setUserDataToStorage();
          resolve(result);
        })
        .catch(result => {
          this.handleApiError(result);
          reject(result);
        });
    });
  }

  /* Sign out */
  signOut() {
    this.user = null;
    this.isAuth = false;
    this.manageAccount.clearData();
    clearDataFromStorage();
    this.fetchApi.signOutApi();

  }

  isConnected(): boolean {
    this.getUserDataFromStorage();
    return this.isAuth && this.user != null && this.user != undefined;
  }

  getUser(): User {
    return this.user;
  }

  private getUserDataFromStorage(): void {
    if (this.isAuth || !keyExist('is_auth')) return;
    this.isAuth = deSerializeData("is_auth") == null ? false : true;
    this.user = User.fromObject(deSerializeData("current_user"));

  }
  private setUserDataToStorage(): void {
    console.log("User", this.isAuth, this.user);
    if (!this.isAuth) return;
    serializeData("is_auth", this.isAuth);
    serializeData("current_user", this.user);
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    // return this.angularFireAuth.auth.currentUser.sendEmailVerification()
    //   .then(() => {
    //     this.router.navigate(['verify-email-address']);
    //   });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    // return this.angularFireAuth.auth.sendPasswordResetEmail(passwordResetEmail)
    //   .then(() => {
    //     window.alert('Password reset email sent, check your inbox.');
    //   }).catch((error) => {
    //     window.alert(error);
    //   });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Sign in with Google
  GoogleAuth() {
    // return this.AuthLogin(new auth.GoogleAuthProvider());
  }


  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    // const userRef: AngularFirestoreDocument<any> = this.fireStorage.doc(`users/${user.uid}`);
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
    // , {
    //   merge: true
    // }
    // const userData: User = new User();
    // userData.hydrate(user);
    // return userRef.set(userData.toString());
  }

  // Sign out 
  // SignOut() {
  //   return this.angularFireAuth.auth.signOut().then(() => {
  //     localStorage.removeItem('user');
  //     this.router.navigate(['login']);
  //   });
  // }

}
