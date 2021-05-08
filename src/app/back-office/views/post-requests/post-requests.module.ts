import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  

import { PackagesComponent } from './packages.component';

import { PostRequestsRoutingModule } from './post-requests-routing.module';
import { PostRequestColisComponent } from './post-request-colis/post-request-colis.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { PostRequestTripsComponent } from './post-request-trip/post-request-trips.component';
import { PostRequestTrip0Component } from './post-request-trip/post-request-trip0/post-request-trip0.component';
import { PostRequestTrip1Component } from './post-request-trip/post-request-trip1/post-request-trip1.component';
import { PostRequestTrip2Component } from './post-request-trip/post-request-trip2/post-request-trip2.component';
import { PostRequestColis0Component } from './post-request-colis/post-request-colis0/post-request-colis0.component';
import { PostRequestColis1Component } from './post-request-colis/post-request-colis1/post-request-colis1.component';
import { PostRequestColis2Component } from './post-request-colis/post-request-colis2/post-request-colis2.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ProgressIndeterminateModule } from '../../../shared/components/progress-indeterminate/progress-indeterminate.module';
import { SearchLocationModule } from '../../components/search-location/search-location.module';
import { InputFileUploadModule } from '../../components/input-file-upload-list/input-file-upload.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PostRequestsRoutingModule,
    MatTabsModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    ProgressIndeterminateModule,
    SearchLocationModule,
    InputFileUploadModule
  ],
  declarations: [
    PackagesComponent,
    PostRequestColisComponent,
    PostRequestColis0Component,
    PostRequestColis1Component,
    PostRequestColis2Component,
    PostRequestTripsComponent,
    PostRequestTrip0Component,
    PostRequestTrip1Component,
    PostRequestTrip2Component
  ]
})
export class PostRequestsModule { }
