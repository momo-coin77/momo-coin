import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Package } from '../../../../shared/entity/package';
import { PackageService } from '../../../../shared/service/back-office/package.service';
import { NotificationService } from '../../../../shared/service/notification/notification.service';

declare var $: any;

@Component({
  selector: 'app-post-request-colis',
  templateUrl: './post-request-colis.component.html',
  styleUrls: ['./post-request-colis.component.scss']
})
@Injectable()
export class PostRequestColisComponent implements OnInit {

  title = 'New Parces request ';
  titleInterface: string;
  interface1 = true;
  interface2 = false;
  interface3 = false;
  visible = true;
  visiblePrev = false;
  posts: any[];

  constructor(
    private router: Router,
    public packageService: PackageService,
    private toastr: ToastrService,
    private notification: NotificationService
  ) { }

  ngOnInit() {

     this.packageService.packageList.subscribe((packages:Map<String,Package>)=>{
      this.posts=this.packageService.getPackageList();
     });
    // console.log(this.posts);
    // this.packageService.getPackages();
    // this.initPage();
    // this.packageService.getAllPackagesUser();
    // this.posts = JSON.parse(localStorage.getItem('packages-list'));
    // console.log('poste variable', this.posts);
  }


  showNotification() {
    this.notification.showNotification('top','center', 'danger', 'pe-7s-close-circle', '\<b>Sorry\</b>\<br>This service was not available now. Tray later.');
  }

}
