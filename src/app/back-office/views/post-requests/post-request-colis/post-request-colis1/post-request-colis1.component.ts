import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Provider, ServiceOfProvider } from '../../../../../shared/entity/provider';
import { User } from '../../../../../shared/entity/user';
import { AuthService } from '../../../../../shared/service/auth/auth.service';
import { CreateColisPackageService } from '../../../../../shared/service/back-office/create-package.service';
import { PackageService } from '../../../../../shared/service/back-office/package.service';
import { ProviderService } from '../../../../../shared/service/back-office/provider.service';
import { TransactionService } from '../../../../../shared/service/back-office/transaction.service';
import { NotificationService } from '../../../../../shared/service/notification/notification.service';
import { UserService } from '../../../../../shared/service/user/user.service';

declare var $: any;

@Component({
  selector: 'app-post-request-colis1',
  templateUrl: './post-request-colis1.component.html',
  styleUrls: ['./post-request-colis1.component.scss']
})
export class PostRequestColis1Component implements OnInit {

  providerList: ServiceOfProvider[] = [];
  selectedProvider: ServiceOfProvider = null;
  selectedUserInfos: User = null;
  viewedProvider: ServiceOfProvider = null;
  waitingProviderInfos: boolean = false;
  findProviderInfosMessage: String = '';
  currentUser: Provider = null;
  userProfileImg = '../../../../assets/img/user_image.jpg';
  message: string = '\<b>Error\</b>\<br>Someone was not going. This option is not available.';

  @ViewChild('myModal') modal;

  constructor(
    private packageCreation:CreateColisPackageService,
    private userService:UserService,
    private authService:AuthService,
    private providerService:ProviderService,
    private router:Router,
    private transactionService:TransactionService,
    private notification: NotificationService) { }

  ngOnInit() {
    this.providerList=this.packageCreation.foundProviders;
    console.log("ProviderList ",this.providerList);
    this.authService.currentUserSubject.subscribe((user:Provider)=>{
      this.currentUser=user;
    })
  }

  cancelModel() {
    this.viewedProvider = null;
    this.modal.hide();
  }

  showProviderDetail(provider) {
    this.modal.show();
    this.userService.getUserById(provider.providerId)
    .then((result)=>{
      this.selectedProvider=provider;
      this.viewedProvider=provider;
      this.selectedUserInfos=result;
      this.waitingProviderInfos=false;
      // console.log("Result ",result,provider)
    })
    .catch((err)=>{
      this.waitingProviderInfos=false;
      this.findProviderInfosMessage=err.message;
      // console.log("Error",err)
    })
  }
  selectProvider(event,provider)
  {
    if(event.target.checked) this.selectedProvider=provider;
    else this.selectedProvider=null;
  }

  savePackage()
  {
    this.waitingProviderInfos=true;    
  }
  
  confirmAction()
  {
    this.waitingProviderInfos=true;
    // this.providerService.setCurrentSelectedProvider(this.selectedProvider);
    this.packageCreation.save()
    .then(()=>{
        this.notification.showNotification('top','center', 'success', 'pe-7s-close-circle', '\<b>Success\</b>\<br>Package has been successfully saved')
        return this.transactionService.startTransaction(
          this.selectedProvider.providerId,
          this.currentUser._id,
          this.packageCreation.package.id,
          this.currentUser._id)
      })    
      .then((result)=>{
        this.waitingProviderInfos=false;
        this.notification.showNotification('top','center', 'success', 'pe-7s-close-circle', '\<b>Success\</b>\<br>Provider has been successfully notified')
        setTimeout(() => this.router.navigate(['dashboard']), 600);
      }).catch((error)=>{
        this.waitingProviderInfos=false;
        this.notification.showNotification('top','center', 'danger', 'pe-7s-close-circle', '\<b>Sorry\</b>\<br>'+error.message)
      })
  }
}
