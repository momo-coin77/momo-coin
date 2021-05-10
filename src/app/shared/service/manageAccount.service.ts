import { Injectable } from '@angular/core';
import { AuthentificationService } from './auth/authentification.service';
import { User } from '../model/user';
import { FetchApiService } from './fetch-api.service';
import { Subject } from 'rxjs';
import { ActionStatut } from '../model/statut';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { serializeData, keyExist, deSerializeData } from '../utils/localStorageSerialization';

@Injectable({
  providedIn: 'root'
})
export class ManageAccountService {
  private users: any[] = [];
  usersSubject = new Subject<any[]>();
  keyLocalStorage = "manage_accound_data";
  constructor(private fetchApi: FetchApiService, private router: Router) {
    // this.handleRouterEvent();
  }
  handleRouterEvent() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        // if(this.users.length>0) serializeData(this.keyLocalStorage,this.users);
      }
      else if (e instanceof NavigationEnd) {
        console.log("end navigation ", this.users);
        // if(keyExist(this.keyLocalStorage)) 
        // {
        //   this.users=deSerializeData(this.keyLocalStorage);
        //   this.emitUser();
        // }
      }
    })
  }
  emitUser(): void {
    this.usersSubject.next(this.users.slice());
  }
  createAccount(newAccount: User): Promise<ActionStatut> {
    return this.fetchApi.createUserApi(newAccount.email, newAccount.password);
  }
  saveAccount(user: User): Promise<ActionStatut> {
    return this.fetchApi.set(`users/${user.id}`, user.toObject());
  }
  updateAccount(email: string, newAccount: User): boolean {
    let position: number = this.findPositionByEmail(email);
    if (position === -1) return false;
    this.fetchApi.update(`users/${this.users[position].id}/`, newAccount);
    this.users.splice(position, 1, newAccount.toObject());
    this.emitUser();
    return true;
  }
  deleteAccount(email: string): boolean {
    let position: number = this.findPositionByEmail(email);
    if (position === -1) return false;
    this.fetchApi.delete(`users/${this.users[position].id}/`);
    this.users.splice(position, 1);
    this.emitUser();
    return true;
  }
  existAccount(email: string) {
    return this.findByEmail(email) !== null;
  }
  findPositionByEmail(email: string): number {
    return this.users.findIndex(user => user.email === email);
  }

  findByEmail(email: string): User {
    let userFinded = this.users.find(user => user.email === email);
    return userFinded === undefined ? null : User.fromObject(userFinded);
  }
  findAccountByIdentity(email: string, name: string): User {
    let position: number = this.findPositionByEmail(email);
    if (position === -1) return null;
    if (this.users[position].name === name) return User.fromObject(this.users[position]);
    return null;
  }
  findById(id: string): User {
    let userFinded = this.users.find(user => user.id === id);
    return userFinded === undefined ? null : User.fromObject(userFinded);
  }
  getUsers(): User[] {
    console.log("get user", this.users)
    return this.users.map(user => User.fromObject(user));
  }
  getCurrentUserFromApi(user: User): Promise<ActionStatut> {
    return new Promise<ActionStatut>((resolve, reject) => {
      this.fetchApi.fetchOnce('users/' + user.id)
        .then(result => {
          // console.log("result fetch",'users/'+user.id,result);        
          this.users.push(result.result);
          this.emitUser();
          resolve(result);
        })
        .catch(error => reject(error));
    });
  }
  getUsersFromApi(): Promise<ActionStatut> {
    return new Promise<ActionStatut>((resolve, reject) => {
      this.fetchApi.fetchOnce('users')
        .then(result => {
          // this.users.concat(result.result);
          this.users = [];
          for (let key in result.result) {
            this.users.push(result.result[key])
          }
          result.result = [];
          // console.log("Users from API",this.users)
          this.emitUser();
          resolve(result);
        })
        .catch(error => reject(error))
    });
  }
  clearData(): void {
    this.users = [];
    this.emitUser();
  }
}
