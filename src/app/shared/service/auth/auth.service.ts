import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserAccountState } from '../../entity/user';
import { DataStateUpdateService } from '../data-state-update/data-state-update.service';
import { EventService } from '../event/event.service';
import { FireBaseConstant } from '../firebase/firebase-constant';
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
    private dateToUpdateService:DataStateUpdateService,
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
          if(emitEvent)
          {
            return this.userService.getUserById(userN.id)                
          }    
          return Promise.resolve(action)
        })
        .then((result)=>{              
          if(emitEvent)
          {
            if(result.result.status==UserAccountState.DESACTIVE)
            {
              result.apiCode=FireBaseConstant.DESACTIVED_ACCOUNT;
              result.result=null;
              this.firebaseApi.handleApiError(result);
              return reject(result);
            }
            this.eventService.loginEvent.next(userN);
          }
          resolve(action)  
          this.localStorageService.setUserData({
            isLoggedIn: true,
            user: result.result
          });              
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
        .then(() =>  {
          user.dateCreation=(new Date()).toISOString();
          return this.userService.addUser(user)
        })
        .then(()=> this.dateToUpdateService.addMaxUserDate(user))
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
