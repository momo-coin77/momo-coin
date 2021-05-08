import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Package, ColisPackage } from '../../../../../shared/entity/package';
import { PackageService } from '../../../../../shared/service/back-office/package.service';
import { SearchLocationComponent } from '../../../../components/search-location/search-location.component';
import { InputFileUploadListComponent } from '../../../../components/input-file-upload-list/input-file-upload-list.component';
import { Vehicle } from '../../../../../shared/entity/provider';
import { CreateColisPackageService } from '../../../../../shared/service/back-office/create-package.service';
import { NotificationService } from '../../../../../shared/service/notification/notification.service';

declare var $: any;

@Component({
  selector: 'app-post-request-colis0',
  templateUrl: './post-request-colis0.component.html',
  styleUrls: ['./post-request-colis0.component.scss']
})
export class PostRequestColis0Component implements OnInit {

  // packageLoaded:ColisPackage=PackageService.currentPackage ;

 
  submitted: boolean=false;
  packageForm: FormGroup;
  title = 'New package request ';
  titleUser: string;
  visible = true;

  @ViewChild('toZone') toZoneWidget: SearchLocationComponent;
  @ViewChild('fromZone') fromZoneWidget: SearchLocationComponent;
  @ViewChild('uploadFile') widgetUploadFile: InputFileUploadListComponent;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private packageCreationService:CreateColisPackageService,
    private packageService:PackageService,
    private notification:NotificationService) { }

  ngOnInit(): void {
    

    this.packageForm = this.formBuilder.group({
      'field_name': [this.packageCreationService.package.title, Validators.required],
      'field_price': [this.packageCreationService.package.suggestedPrice, Validators.required],
     
      'field_isWeak': [this.packageCreationService.package.is_weak, Validators.required],
      'field_isUrgent': [this.packageCreationService.package.is_urgent, Validators.required],
      'field_delayDate': [this.packageCreationService.package.date_arrival, Validators.required],
      'field_recipientName': [this.packageCreationService.package.receiver.name, Validators.required],
      'field_recipientContact': [this.packageCreationService.package.receiver.contact, Validators.required],
      'field_typeof': [this.packageCreationService.package.typeof, Validators.required],
      'field_numberPackage': [this.packageCreationService.package.size_piece_nber, Validators.required],
      // 'field_vehicleType': [this.packageCreationService.package.carTypeList.length>0?this.packageCreationService.package.carTypeList[0].type:"",Validators.required ],
      'field_heightPackages': [this.packageCreationService.package.size_heigth],
      'field_widhtPackage': [this.packageCreationService.package.size_width, ],
      'field_weightPackage': [this.packageCreationService.package.size_depth, ],
      'field_lengthPackage': [this.packageCreationService.package.size_piece_length, ],
      'field_descriptionPackage': [this.packageCreationService.package.description, Validators.required]
    });

  }

  get f() {
    return this.packageForm.controls;
  }

  submit() {

    if (this.fromZoneWidget.selectedLocation.length < 1) {
      this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', `\<b>Error !\</b>\<br> You must specify the place of departure `);
      return;
    }
    if (this.toZoneWidget.selectedLocation.length < 1) {
      this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', `\<b>Error !\</b>\<br> You must specify the place of arrival `);
      return;
    }
    if (this.widgetUploadFile.getDocumentsList().length < 1) {
      this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', `\<b>Error !\</b>\<br> you must provide at least one picture of your package `);
      return;
    }
    if (!this.packageForm.valid) {
      this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', `\<b>Error !\</b>\<br> Invalid Package form`);
      return;
    }

    this.packageCreationService.package.title=this.packageForm.value.field_name;
    this.packageCreationService.package.suggestedPrice=this.packageForm.value.field_price;
     
    this.packageCreationService.package.is_weak=this.packageForm.value.field_isWeak;
    this.packageCreationService.package.is_urgent=this.packageForm.value.field_isUrgent;
    this.packageCreationService.package.date_arrival=this.packageForm.value.field_delayDate;
    this.packageCreationService.package.package_name=this.packageForm.value.field_name;
    this.packageCreationService.package.receiver.name=this.packageForm.value.field_recipientName;
    this.packageCreationService.package.receiver.contact=this.packageForm.value.field_recipientContact;
    this.packageCreationService.package.typeof=this.packageForm.value.field_typeof;
    this.packageCreationService.package.size_piece_nber=this.packageForm.value.field_numberPackage;

    let voitureType:Vehicle=new Vehicle();
    // voitureType.type=this.packageForm.value.field_vehicleType;

    this.packageCreationService.package.carTypeList.push(voitureType);
    this.packageCreationService.package.suggestedPrice=this.packageForm.value.field_price;
    this.packageCreationService.package.size_width=this.packageForm.value.field_widhtPackage;
    this.packageCreationService.package.size_depth=this.packageForm.value.field_weightPackage;
    this.packageCreationService.package.size_heigth=this.packageForm.value.field_heightPackages;    
    this.packageCreationService.package.size_piece_length=this.packageForm.value.field_lengthPackage;
    this.packageCreationService.package.description=this.packageForm.value.field_descriptionPackage;
    this.packageCreationService.package.from=this.fromZoneWidget.selectedLocation[0];
    this.packageCreationService.package.to=this.toZoneWidget.selectedLocation[0]
    this.packageCreationService.package.images=this.widgetUploadFile.getDocumentsList();

         
      this.packageCreationService.package=this.packageCreationService.package;
      this.submitted=true;
      console.log("Package: ",this.packageCreationService.package)
      // this.packageService.packageCreation(this.packageCreationService.package)
      this.packageCreationService.findProvider()
      .then((result:any)=>{
        this.submitted=false;
        // this.showNotification('top','center', 'success', 'pe-7s-close-circle', '\<b>Success\</b>\<br>Service was created successfully')
        setTimeout(() => {
          this.router.navigate(['/post-requests/packages/list-providers'])
        }, 600);
      })
      .catch((error) => {
        console.log(error);
        this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry\</b>\<br>' + error.message);
        this.submitted = false;
      });

  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy(): void {
  }
}
