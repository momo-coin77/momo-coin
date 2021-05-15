import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserAccountState } from '../../entity/user';
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
      if (this.listUser.has(id.toString())) { 
        let result:ResultStatut=new ResultStatut();
        result.result=this.listUser.get(id.toString());
        return resolve(result); 
      }
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
      // console.log("User ",user.toString())
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

  changeStatusUsingId(idUser:EntityID):Promise<ResultStatut>
  {
      return this.getUserById(idUser)
      .then((result:ResultStatut)=>this.changeStatus(result.result.id))
  }
  changeStatus(user:User):Promise<ResultStatut>
  {
    let nstatus=UserAccountState.ACTIVE==user.status?UserAccountState.DESACTIVE:UserAccountState.ACTIVE;
    return new Promise<ResultStatut>((resolve,reject)=>{
      this.firebaseApi.updates([{
        link:`users/${user.id.toString()}/status`,
        data:nstatus
      }])
      .then((result)=>{
        this.usersSubject.getValue().get(user.id.toString()).status = nstatus;
        resolve(result)
      })
      .catch((error)=>{
        this.firebaseApi.handleApiError(error)
        reject(error);
      })
    })
  }

  updateUser(user:User):Promise<ResultStatut>
  {
    return new Promise<ResultStatut>((resolve, reject)=>{
      this.firebaseApi.update(`users/${user.id.toString()}`,user.toString())
      .then((result:ResultStatut)=>resolve(result))
      .catch((error:ResultStatut)=>{
        this.firebaseApi.handleApiError(error);
        reject(error);
      })
    })
  }

}
