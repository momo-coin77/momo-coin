import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../entity/user';
import { ResultStatut } from '../firebase/resultstatut';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { EntityID } from '../../entity/EntityID';
import { EventService } from '../event/event.service';
// import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  listUser: Map<String, User> = new Map<string, User>();
  usersSubject: BehaviorSubject<Map<String, User>> = new BehaviorSubject<Map<String, User>>(this.listUser);



  constructor(
    private firebaseApi: FirebaseApi,
    private eventService:EventService
  ) { 

    this.eventService.loginEvent.subscribe((user:User)=>{
      this.newUserHandler();
    })
  }

  newUserHandler():Promise<ResultStatut>
  {
    return new Promise<ResultStatut>((resolve,reject)=>{
      this.firebaseApi.getFirebaseDatabase()
      .ref("users")
      .on('child_added',(snapshot)=>{
        let user:User =new User();
        user.hydrate( snapshot.val());        
        if(!this.listUser.has(user.id.toString())) 
        {
          this.listUser.set(user.id.toString(),user);
          this.usersSubject.next(this.listUser)
          console.log(snapshot.val(),this.listUser)
        }
      })
    })
  }
  getListUser(): User[] {
    let r: User[] = [];
    this.listUser.forEach((value: User) => r.push(value));
    console.log('les user service ' + this.listUser);
    return r;
  }

  setUser(user: User) {
    if (!this.listUser.has(user.id.toString())) { this.listUser.set(user.id.toString(), user) }
  }

  // recuperer les informations d'un utilisateur
  getUserById(id: EntityID): Promise<ResultStatut> {
    return new Promise<any>((resolve, reject) => {
      if (this.listUser.has(id.toString())) { return resolve(this.listUser.get(id.toString())); }
      this.firebaseApi.fetchOnce(`users/${id.toString()}`)
        .then((result: ResultStatut) => {
          let user: User = new User();
          user.hydrate(result.result);
          this.listUser.set(user.id.toString(), user);
          this.usersSubject.next(this.listUser);
          result.result = user;
          resolve(result);
        })
        .catch((error) => {
          this.firebaseApi.handleApiError(error);
          reject(error);
        });
    });
  }

  addUser(user: User): Promise<ResultStatut> {
    return new Promise<ResultStatut>((resolve, reject) => {
      if (this.listUser.has(user.id.toString())) { return resolve(new ResultStatut()); }
      this.firebaseApi.set(`users/${user.id.toString()}`, user.toString())
        .then((result) => {
          this.listUser.set(user.id.toString(), user);
          this.usersSubject.next(this.listUser);
          resolve(new ResultStatut());
        }).catch((error) => {
          this.firebaseApi.handleApiError(error);
          reject(error);
        });
    });
  }

  chabgeStatus(data, id) {
  }

}
