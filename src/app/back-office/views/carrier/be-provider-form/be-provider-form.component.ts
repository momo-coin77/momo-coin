import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ElementRef, OnInit, TemplateRef } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Address, Provider, ServiceOfProvider, Zone, Document } from '../../../../shared/entity/provider';
import { ProviderService } from '../../../../shared/service/back-office/provider.service';
import { ZoneService } from '../../../../shared/service/zone/zone.service';
import { MatDialog } from '@angular/material';
import { SearchLocationComponent } from '../../../components/search-location/search-location.component';
import { InputFileUploadComponent } from '../../../components/input-file-upload-list/input-file-upload/input-file-upload.component';
import { InputFileUploadListComponent } from '../../../components/input-file-upload-list/input-file-upload-list.component';

declare var $: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'be-provider-form',
  templateUrl: 'be-provider-form.component.html',
  styleUrls: ['be-provider-form.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class BeProviderFormComponent implements OnInit, AfterViewInit {
  submitted: boolean = false;

  //list of selected locations
  selectedLocations: Zone[] = [];
  tabList = [];
  //list of location
  locations: Zone[] = [];

  //search location component
  @ViewChild("personnalZone") personnalWidgetZone: SearchLocationComponent;
  @ViewChild("compagnyZone") compagnyWidgetZone: SearchLocationComponent;

  //upload file component
  @ViewChild("personnalUploadFile") personnalWidgetUploadFile: InputFileUploadListComponent;
  @ViewChild("compagnyUploadFile") compagnyWidgetUploadFile: InputFileUploadListComponent;


  bePersonnalCarrierForm: FormGroup;
  beCompagnyCarrierForm: FormGroup;

  isCompagnyAccount = false;
  waitForSubmittionProviderPersonnalForm: boolean = false;
  waitForSubmittionProviderCompanyForm: boolean = false;


  //adress for verification
  addresseForVerification: Address[] = [];

  //error message
  errorMessage: String = "";

  constructor(
    private modalService: NgbModal,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private providerService: ProviderService,
    private zoneService: ZoneService) { }

  ngAfterViewInit(): void { }

  ngOnInit(): void {
    this.bePersonnalCarrierForm = new FormGroup({
      'field_service_title': new FormControl('', [Validators.required]),
      'field_service_description': new FormControl('', [Validators.required]),
      'fiel_adPersonal1': new FormControl(''),
      'fiel_adPersonal2': new FormControl(''),
      'fiel_adPersonal3': new FormControl(''),
      'fiel_adPersonal4': new FormControl(''),
      'fiel_passportNumber': new FormControl('', [Validators.required])
    })
    this.beCompagnyCarrierForm = new FormGroup({
      'field_companyName': new FormControl('', [Validators.required]),
      'field_impExpCode': new FormControl('', [Validators.required]),
      'field_regNum': new FormControl('', [Validators.required]),
      'fiel_adCompany1': new FormControl(''),
      'fiel_adCompany2': new FormControl(''),
      'fiel_adCompany3': new FormControl(''),
      'fiel_adCompany4': new FormControl(''),
      'field_service_description': new FormControl('', [Validators.required]),
      'field_service_title': new FormControl('', [Validators.required]),
      'fiel_passportNumber': new FormControl('', [Validators.required]),
      'fiel_compagnyaddress': new FormControl('', [Validators.required])
    });

  }

  getListAddresse() {
    this.addresseForVerification = [];
    if (this.isCompagnyAccount) {
      if (this.beCompagnyCarrierForm.value.fiel_adCompany1.length > 0) {
        let add = new Address();
        add.email = this.beCompagnyCarrierForm.value.fiel_adCompany1;
        this.addresseForVerification.push(add);
      }
      if (this.beCompagnyCarrierForm.value.fiel_adCompany2.length > 0) {
        let add = new Address();
        add.email = this.beCompagnyCarrierForm.value.fiel_adCompany2;
        this.addresseForVerification.push(add);
      }
      if (this.beCompagnyCarrierForm.value.fiel_adCompany3.length > 0) {
        let add = new Address();
        add.email = this.beCompagnyCarrierForm.value.fiel_adCompany3;
        this.addresseForVerification.push(add);
      }
      if (this.beCompagnyCarrierForm.value.fiel_adCompany4.length > 0) {
        let add = new Address();
        add.email = this.beCompagnyCarrierForm.value.fiel_adCompany4;
        this.addresseForVerification.push(add);
      }
    }
    else {
      if (this.bePersonnalCarrierForm.value.fiel_adPersonal1.length > 0) {
        let add = new Address();
        add.email = this.bePersonnalCarrierForm.value.fiel_adPersonal1;
        this.addresseForVerification.push(add);
      }
      if (this.bePersonnalCarrierForm.value.fiel_adPersonal2.length > 0) {
        let add = new Address();
        add.email = this.bePersonnalCarrierForm.value.fiel_adPersonal2;
        this.addresseForVerification.push(add);
      }
      if (this.bePersonnalCarrierForm.value.fiel_adPersonal3.length > 0) {
        let add = new Address();
        add.email = this.bePersonnalCarrierForm.value.fiel_adPersonal3;
        this.addresseForVerification.push(add);
      }
      if (this.bePersonnalCarrierForm.value.fiel_adPersonal4.length > 0) {
        let add = new Address();
        add.email = this.bePersonnalCarrierForm.value.fiel_adPersonal4;
        this.addresseForVerification.push(add);
      }
    }

  }

  getLocation() {
    this.selectedLocations = [];
    if (this.isCompagnyAccount) this.selectedLocations = this.compagnyWidgetZone.selectedLocation;
    else this.selectedLocations = this.personnalWidgetZone.selectedLocation;
  }

  getFile(): Document[] {
    if (this.isCompagnyAccount) return this.compagnyWidgetUploadFile.getDocumentsList();
    else return this.personnalWidgetUploadFile.getDocumentsList();
  }
  submit() {
    this.submitted = true;
    let value = {};
    this.getListAddresse();
    this.getLocation();

    if (this.addresseForVerification.length < 2) {
      this.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', `\<b>Error !\</b>\<br> You should give at least 2 address for verification`);
      return;
    }
    // console.log("Here is a test for company personnal for",this.isCompagnyAccount)

    if (this.selectedLocations.length < 1) {
      this.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', `\<b>Error !\</b>\<br> You should give at least one deserved zone`);
      return;
    }

    let providerType: number;
    if (this.isCompagnyAccount) {
      if (!this.beCompagnyCarrierForm.valid) {
        // this.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', `\<b>Error !\</b>\<br> Invalid Compagny form`);
        return;
      }
      this.waitForSubmittionProviderCompanyForm = true;
      value = {
        title: this.beCompagnyCarrierForm.value.field_service_title,
        description: this.beCompagnyCarrierForm.value.field_service_description,
        zones: this.selectedLocations,
        companyName: this.beCompagnyCarrierForm.value.field_companyName,
        registrationNumber: this.beCompagnyCarrierForm.value.field_regNum,
        importExportCompagnyCode: this.beCompagnyCarrierForm.value.field_impExpCode,
        addressForVerification: this.addresseForVerification,
        passportNumber: this.beCompagnyCarrierForm.value.fiel_passportNumber,
        companyAddress: this.beCompagnyCarrierForm.value.fiel_compagnyaddress
      };
      providerType = 1;
    }
    else {
      if (!this.bePersonnalCarrierForm.valid) {
        // this.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', `\<b>Error !\</b>\<br> Invalid Personnal form`);
        return;
      }
      this.waitForSubmittionProviderPersonnalForm = true;

      value = {
        title: this.bePersonnalCarrierForm.value.field_service_title,
        description: this.bePersonnalCarrierForm.value.field_service_description,
        zones: this.selectedLocations,
        addressForVerification: this.addresseForVerification,

        passportNumber: this.bePersonnalCarrierForm.value.fiel_passportNumber,
      };
      providerType = 0;
    }
    value['documents'] = this.getFile().map((doc: Document) => doc.toString());
    let provider: Provider = new Provider();
    provider.hydrate(value);

    let service: ServiceOfProvider = new ServiceOfProvider();
    service.hydrate(value);
    // console.log("Become provider: Service", service, " provider: ", provider)
    this.providerService.becomeProvider(provider, service, providerType)
      .then((result) => {
        this.showNotification('top', 'center', 'success', 'pe-7s-gift', '\<b>Congratulations !\</b>\<br>Your request has been taken into account. You will be notified after verification of the information.')
        setTimeout(() => this.router.navigate['/carrier/wait-acceptance'], 4000);
        this.waitForSubmittionProviderCompanyForm = false;
        this.waitForSubmittionProviderPersonnalForm = false;
      })
      .catch((error) => {
        this.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', `\<b>Error !\</b>\<br> ${error.message}`)
        this.waitForSubmittionProviderCompanyForm = false;
        this.waitForSubmittionProviderPersonnalForm = false;
      })
  }

  // add a service

  showNotification(from, align, colortype, icon, text) {

    $.notify({
      icon: icon,
      message: text
    }, {
      type: colortype,
      timer: 300,
      placement: {
        from: from,
        align: align
      }
    });
  }
  get fPersonnal() {
    return this.bePersonnalCarrierForm.controls;
  }
  get fCompagny() {
    return this.beCompagnyCarrierForm.controls;
}

}


  // visible = true;
  // selectable = true;
  // removable = true;
  // separatorKeysCodes: number[] = [ENTER, COMMA];
  // fruitCtrl = new FormControl();
  // filteredFruits: Observable<string[]>;
  // fruits: string[] = ['My location'];
  // allFruits: string[] = [
  //   'Abong-Mbang',
  //   'Akonolinga',
  //   'Bafang',
  //   'Bafoussam',
  //   'Bamenda',
  //   'Bangangté',
  //   'Bertoua',
  //   'Buea',
  //   'Douala',
  //   'Dschang',
  //   'Ebolowa',
  //   'Edéa',
  //   'Foumban',
  //   'Foumbot',
  //   'Garoua',
  //   'Gazawa',
  //   'Kaélé',
  //   'Kousséri',
  //   'Koutaba',
  //   'Kribi',
  //   'Kumba',
  //   'Limbé',
  //   'Loum',
  //   'Makénéné',
  //   'Mamfé',
  //   'Manjo',
  //   'Maroua',
  //   'Mbalmayo',
  //   'Mbanga',
  //   'Mbouda',
  //   'Melong',
  //   'Mora',
  //   'Nanga-Eboko',
  //   'Ngaoundal',
  //   'Ngaoundéré',
  //   'Nkongsamba',
  //   'Obala',
  //   'Pitoa',
  //   'Sangmélima',
  //   'Tcholliré',
  //   'Tibati',
  //   'Tiko',
  //   'Tombel',
  //   'Tonga',
  //   'Touboro',
  //   'Wum',
  //   'Yabassi',
  //   'Yagoua',
  //   'Yaoundé',
  //   'Yokadouma'];
