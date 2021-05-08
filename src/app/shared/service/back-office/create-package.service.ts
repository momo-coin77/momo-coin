import { Injectable } from '@angular/core';
import { ColisPackage, Package } from '../../entity/package';
import { ServiceOfProvider, Zone } from '../../entity/provider';
import { PackageService } from './package.service';
import { ProviderService } from './provider.service';

export class PackageCreationState
{
  static SUBMIT_FORM=0;
  static PROVIDER_FOUND=1;
  static SUBMIT_PACKAGE_CREATION=2;
}

@Injectable({
  providedIn: 'root'
})
export class CreateColisPackageService
{
  state=PackageCreationState.SUBMIT_FORM;  
  foundProviders:ServiceOfProvider[]=[];
  package:ColisPackage=new ColisPackage();
  constructor(protected packageService:PackageService,protected providerService:ProviderService) { }

  
  findProvider():Promise<any> {
    return new Promise<any>((resolve,reject)=>{
      this.providerService.findProvider(this.package.from,this.package.to)
      .then((result:ServiceOfProvider[])=>{
        this.foundProviders= result;
        this.state=PackageCreationState.PROVIDER_FOUND;
        resolve(null);
      })
      .catch((error)=> reject(error))
    })
  }

  save():Promise<any>
  {
    return new Promise<any>((resolve,reject)=>{
      this.packageService.packageCreation(this.package)
      .then((id)=>{
        this.package.id=id;
        resolve(null);
      })
    })
  }
  
}
