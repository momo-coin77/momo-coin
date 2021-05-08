import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ToastrService } from 'ngx-toastr';
import { Package, packageBuilder } from '../../../shared/entity/package';
import { ProviderService } from './provider.service';
import { Provider,ServiceOfProvider, Zone } from '../../entity/provider';
import { EventService } from '../event/event.service';
import { BehaviorSubject } from 'rxjs';
import { TransactionService } from './transaction.service';



@Injectable({
    providedIn: 'root'
})
export class PackageService {
    packages: Map<String,Package>=new Map<String,Package>();
    packageList:BehaviorSubject<Map<String,Package>> = new BehaviorSubject<Map<String,Package>>(this.packages)
    headers = {};
    constructor(
        private api: ApiService,
        private toastr: ToastrService,
        private transactionService:TransactionService,
        private providerService:ProviderService,
        private eventService:EventService
    ) { 
        this.eventService.loginEvent.subscribe(()=>{
            this.headers = {
                'Authorization': 'Bearer ' + this.api.getAccessToken(),
                'Content-Type': 'application/json',
                // 'Accept': 'application/json'
              };
              this.getAllPackagesUser();
        });

        this.eventService.findPackageEvent.subscribe((packageId:string)=>{
            this.findPackageById(packageId);
        })
    }

    findLocalPackagesById(id: String): Package {
        if (this.packages.has(id)) { return this.packages.get(id); }
        return null;
    }
    findPackageById(id: String): Promise<Package> {
        if(id.length==0) return;
        return new Promise((resolve, reject) => {
            if (this.packages.has(id.toString()))  resolve(this.packages.get(id.toString()));
            else {
                this.api.get(`requester/service/${id}`, {
                    'Authorization': 'Bearer ' + this.api.getAccessToken(),
                    'Content-Type': 'application/json',
                    // 'Accept': 'application/json'
                  }).subscribe(success=>{
                      if(success && success.resultCode==0)
                      {
                          let pack:Package =packageBuilder(success.result);
                          if(!this.packages.has(pack.id.toString()))
                          {
                            this.packages.set(pack.id.toString(),pack);
                            this.packageList.next(this.packages)
                          }
                         resolve(pack);
                      }
                      else reject(null);
                  }, (error: any)=> reject(null))
            }
        })
    }

   
    getPackageList()
    {
        let list:Package[]=[];
        for(const key in this.packages)
        {
            list.push(this.packages.get(key));
        }
        return list;
    }

    getAllPackagesUser(): Promise<any> {
        return new Promise((resolve, reject) => {
          this.api.get('requester/service/list', this.headers)
          .subscribe((response: any) => {
            if (response) {
                if(response.resultCode==0)
                {
                    response.result.map((pkg:Record<string,any>)=>{
                        let pack:Package= packageBuilder(pkg);
                        if(!this.packages.has(pack.id)) this.packages.set(pack.id.toString(),pack);
                        this.transactionService.setTransactionFromAPI(pkg);
                    })
                    this.packageList.next(this.packages);
                    resolve(response);
                }
                reject(response)        
            }

          }, (error: any) => {
              reject(error);
          });
        });
      }


// permet d'enregistrer un package
    packageCreation(data: Package): Promise<any> {
        return new Promise((resolve, reject) => {
            const headers = {
                'Authorization': 'Bearer ' + localStorage.getItem('access-token'),
                'Content-Type': 'application/json',
                // 'X-CSRF-Token': 'FWjJkOClVTMzyhEPEhz_OPR3PulweXUqi-NePcofKU8' || JSON.parse(localStorage.getItem('app-token')),
                // 'Accept': 'application/json',
            };
            // console.log("Header ",headers);

            this.api.post('requester/service/add', data.toString(), headers)
            .subscribe(success => {
                if(success.resultCode === 0)
                {                
                    // this.packages.set(success.result.idService,data);
                    //this.toastr.success('You have been successfully Register your package!');               
                    resolve(success.result.idService);
                }
                else
                {
                    reject(success);
                }
            }, error => {
                //this.toastr.success(error.message);
                reject(error);
            });
        })

    }
    // permet d'update les infos d'un package
    updatePackage(nid: string, data: Package): Promise<any> {

        return new Promise((resolve, reject) => {

            const headers = {
                'Authorization': 'Bearer ' + + localStorage.getItem('access-token'),
                'Content-Type': 'application/json'
            };
            this.api.post(`requester/service/${nid}`, data.toString(), headers)
            .subscribe(success => {
                if(success && success.resultCode==0)
                {
                    this.packages.set(success.result.idService,data);
                    
                    //this.toastr.success('You have been successfully Register your package!');
                    resolve(success);
                }
                else reject(success);
            }, error => {
                reject(error);
            });
        });
    }

    acceptPackagePrice(pack: Package, idProvider: String, idTransaction: String) {
        this.api.post('requester/service/transaction/valid_price',
            {
                idService: pack.id,
                idProvider,
                idTransaction,
                price: pack.suggestedPrice
            },
            {
                'Authorization': 'Bearer ' + + localStorage.getItem('access-token'),
                'Content-Type': 'application/json'
            }
        );
    }

    

}
