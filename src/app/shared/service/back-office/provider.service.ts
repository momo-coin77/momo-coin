import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Provider, ServiceOfProvider, Zone } from '../../entity/provider';
import { User } from '../../entity/user';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../event/event.service';
import { ServiceOfProviderLocalStorageService } from '../localstorage/serviceofprovider-local-storage.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  currentServiceOfProvider: BehaviorSubject<ServiceOfProvider> = new BehaviorSubject<ServiceOfProvider>(new ServiceOfProvider());
  currentUser:Provider=null;
  headers = {};

  listOfService: Map<String, ServiceOfProvider> = new Map<String, ServiceOfProvider>();


  constructor(private api: ApiService, 
    private userService: UserService,
    private authService:AuthService,
    private eventService:EventService,
    private serviceOfProviderLocalStorage:ServiceOfProviderLocalStorageService,
    ) {
    this.headers = {
      'Authorization': 'Bearer ' + this.api.getAccessToken(),
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    this.serviceOfProviderLocalStorage.dataService.subscribe((dataService:ServiceOfProvider)=>
    {
      this.currentServiceOfProvider.next(dataService);
    });
    this.eventService.loginEvent.subscribe((value:boolean)=>{
      console.log("Valu loginevent ",value)
      if(!value) return;
      this.getServiceOfProviderFromApi();
    });
    this.authService.currentUserSubject.subscribe((user:Provider)=>{
      this.currentUser=user;
    })
  }

  // getProvider(id: String): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     if (this.listOfProvider.has(id)) return resolve(this.listOfProvider.get(id));
  //     this.userService.getUserById(id)
  //       .then((success) => {
  //         let provider: Provider = new Provider();
  //         if (success.resultCode == 0) {
  //           provider.hydrate(success.result);
  //           this.listOfProvider.set(provider._id, provider);
  //           resolve(provider);
  //         }
  //         else reject(success);
  //       })
  //       .catch((error) => reject(error));
  //   })
  // }

  getServiceOfProviderFromApi(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log("header: ",this.headers)
      this.api.get(`provider/service/${this.currentUser._id}`, this.headers)
        .subscribe((result) => {
          if (result && result.resultCode == 0) {
            let currentServiceOfProvider = new ServiceOfProvider();
            currentServiceOfProvider.hydrate(result.result);
            console.log("Service ",result,currentServiceOfProvider)
            this.serviceOfProviderLocalStorage.setData(currentServiceOfProvider)
            // this.currentServiceOfProvider.next(currentServiceOfProvider)
            resolve(true);
          }
          else reject(result)
        })
    })
  }

  becomeProvider(provider: Provider, service: ServiceOfProvider, providerType: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.api.post('auth/provider',
        {
          type: providerType,
          ...provider.toString(),
          ...service.toString()
        }, this.headers)
        .subscribe((result) => {
          if (result && result.resultCode == 0) {
            provider._id = result.result.idService;
            let cprovider:Provider= this.authService.currentUserSubject.value;
            cprovider.hydrate(provider);
            this.serviceOfProviderLocalStorage.setData(service);
            this.authService.resetDataUser(cprovider);
            resolve(true);
          }
          else reject(result);
        }, (error: any) => reject(error))
    });
  }
  findProvider(startLocalisation:Zone, endLocalisation:Zone):Promise<any>
    {
        return new Promise<any>((resolve,reject)=>{
            this.api.post("provider/service/find",{
              start:startLocalisation.toString(),
              end:endLocalisation.toString()
            },
            this.headers).subscribe((success)=>{
              if(success.resultCode==0)
              {
                console.log(success)
                let result:ServiceOfProvider[]=success.result.providers.map((service:Record<string,any>)=>{
                  let serviceOfProvider:ServiceOfProvider=new ServiceOfProvider();
                  serviceOfProvider.hydrate(service.service);
                  if(!this.listOfService.has(serviceOfProvider._id)) this.listOfService.set(serviceOfProvider._id,serviceOfProvider);
                  
                  let provider:Provider = new Provider();
                  provider.hydrate(service.provider);
                  this.userService.setUser(provider);

                  if(provider.isCompany) serviceOfProvider.name=provider.companyName
                  else serviceOfProvider.name=provider.getSimpleName();
                  return serviceOfProvider;
                }) 
                resolve(result);               
              }
              else reject(success);
            },
            (error)=> reject(error))
        })
    }

}