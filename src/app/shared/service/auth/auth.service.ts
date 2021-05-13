import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../entity/user';
import { EventService } from '../event/event.service';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { ResultStatut } from '../firebase/resultstatut';
import { UserLocalStorageData, UserlocalstorageService } from '../localstorage/userlocalstorage.service';
import { UserService } from '../user/user.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User = new User();
  isLoggedIn: boolean = false;
  currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>(this.currentUser);


  constructor(private firebaseApi: FirebaseApi,
    private localStorageService: UserlocalstorageService,
    private eventService:EventService,
    private userService: UserService) {
    this.localStorageService.dataUser.subscribe((userData: UserLocalStorageData) => {
      this.isLoggedIn = userData.isLoggedIn;
      this.currentUser = userData.user;
      this.currentUserSubject.next(this.currentUser);
    });
  }

  signIn(userN: User,emitEvent:boolean=true): Promise<ResultStatut> {
    let action = new ResultStatut();
    return new Promise<ResultStatut>((resolve, reject) => {
      this.firebaseApi.signInApi(userN.email, userN.password)
        .then(result => {
          // userN.password="";
          userN.name = result.result.user.displayName;
          userN.email = result.result.user.email;
          userN.photoUrl = result.result.user.photoUrl || "";
          userN.id.setId(result.result.user.uid);
          return this.userService.getUserById(userN.id)          
        })
        .then((result)=>{
          this.localStorageService.setUserData({
            isLoggedIn: true,
            user: result.result
          });
          if(emitEvent) { this.eventService.loginEvent.next(userN); }
          resolve(action)
        })
        .catch(result => {
          this.firebaseApi.handleApiError(result);
          reject(result);
        })
    });
  }

  signOut(): void {
    this.firebaseApi.signOutApi();
    this.localStorageService.clearData();
    this.eventService.logoutEvent.next(true);
  }


  signInNewUser(user: User) {
    return new Promise<ResultStatut>((resolve, reject) => {
      this.firebaseApi.createUserApi(user.email, user.password)
        .then(() => this.signIn(user,false))
        .then(() => this.userService.addUser(user))
        .then(() => {
          this.signOut();
          resolve(new ResultStatut());
        })
        .catch(e => {
          this.firebaseApi.handleApiError(e);
          reject(e)
        })
    });
  }
}
