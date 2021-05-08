// Angular
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { VehiclesComponent } from './vehicles/vehicles.component';

// Forms Component
import { SettingsComponent } from './settings/settings.component';

// Components Routing
import { CarrierRoutingModule } from './carrier-routing.module';
import { ProgressIndeterminateModule } from '../../../shared/components/progress-indeterminate/progress-indeterminate.module';
import { BeProviderComponent } from './be-provider/be-provider.component';
import { WaitAcceptanceComponent } from './wait-acceptance/wait-acceptance.component';

import { SearchLocationModule } from '../../components/search-location/search-location.module';

// import { ButtonModule } from '@syncfusion/ej2-angular-buttons';


import { InputFileUploadModule } from '../../components/input-file-upload-list/input-file-upload.module';
import { CdkTreeModule } from '@angular/cdk/tree';

import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
// import { AutoCompleteModule } from '@syncfusion/ej2-angular-dropdowns';

import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
  MatFormFieldModule,
  MatTabsModule,
} from '@angular/material';
import { TabMaterialModule } from '../../../shared/components/tab-material/tab-material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BeProviderFormComponent } from './be-provider-form/be-provider-form.component';



const materialModules = [
  CdkTreeModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatButtonToggleModule,
  MatTreeModule,
  OverlayModule,
  PortalModule,
  MatBadgeModule,
  MatGridListModule,
  MatRadioModule,
  MatDatepickerModule,
  MatTooltipModule
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CarrierRoutingModule,
    ProgressIndeterminateModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatExpansionModule,
    SearchLocationModule,
    InputFileUploadModule,
    // AutoCompleteModule,
    SearchLocationModule,
    MatTabsModule,
    InputFileUploadModule
  ],
  declarations: [
    VehiclesComponent,
    SettingsComponent,
    BeProviderComponent,
    WaitAcceptanceComponent,
    BeProviderFormComponent
  ],
  exports: [
    ...materialModules
  ]
})
export class CarrierModule { }
