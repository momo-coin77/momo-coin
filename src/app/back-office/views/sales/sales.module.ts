// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SalesComponent } from './sales/sales.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SalesRoutingModule } from './sales-routing.module';
import { SpinnerModule } from '../../../shared/components/spinner/spinner.module';


@NgModule({
  imports: [
    SalesRoutingModule,
    CommonModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    SpinnerModule
  ],
  declarations: [
    SalesComponent,
  ]
})
export class SalesModule { }
