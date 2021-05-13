// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PurchasesComponent } from './purchases/purchases.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PurchasesRoutingModule } from './purchases-routing.module';
import { SpinnerModule } from '../../../shared/components/spinner/spinner.module';

@NgModule({
  imports: [
    PurchasesRoutingModule,
    CommonModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    SpinnerModule
  ],
  declarations: [
    PurchasesComponent,
  ]
})
export class PurchasesModule { }
