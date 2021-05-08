import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { GeneraleService } from '../generale/generale.service';
import { ParametersService } from '../../../shared/parameters/parameters.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Provider, User } from '../../entity/provider';
// import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {


  usersSubject: Subject<User[]> = new Subject<User[]>();

  listUser: Map<string,User> = new Map<string,User>();

  constructor(
    private api: ApiService,
    private generalService: GeneraleService,
    private parameters: ParametersService,
    private router: Router,
    private toastr: ToastrService,
    //private login: AuthService
  ) { }


  getListUser():User[]
  {
    let r:User[]=[];
    this.listUser.forEach((value:User)=> r.push(value));
    return r;
  }
  emitUsersData() {
    this.usersSubject.next( this.getListUser());
  }




  // permet d'update les infos d'un user
  UpdateUser(nid: string, token: string, data: any): Promise<any> 
  {
    return new Promise<any>((resolve,reject)=>{

    })
  }

  // permet d enregistrer les pays y compris les choix des villes fait par le user
  saveCountriesAndCities(token: string, data: any): Promise<any> {

    return new Promise((resolve, reject) => {
    });
  }



  // Permet d enregistrer un document personnel du user (ID CARD, PROOF OF RESIDENCE, ...)
  saveUserDocument(token: string, data: any): Promise<any> {

    return new Promise((resolve, reject) => {

      const headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/hal+json'
      }
    });
  }

  // touts les types ID(card id, passporId)
  getAllIdType(): Promise<any> {
    return this.generalService.getAllElement(this.parameters.allTypeId);
  }

  setUser(user:User)
  {
    if(! this.listUser.has(user._id.toString())) this.listUser.set(user._id.toString(),user)
  }

  //recuperer les informations d'un utilisateur
  getUserById(id: String): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (this.listUser.has(id.toString())) resolve(this.listUser.get(id.toString()));
      else {
        this.api.get(`user/profil/${id}`, {
          'Authorization': 'Bearer ' + this.api.getAccessToken(),
        }).subscribe(success => {
          if (success) {
            if (success.resultCode == 0) {
              let user:Provider=new Provider();
              user.hydrate(success.result);
              this.listUser.set(user._id.toString(),user);
              this.emitUsersData();
              resolve(user);
            }
            else reject(success)

          }
          else reject(success)
        }, error => {
          reject(error);
        })
      }
    })
  }

}
