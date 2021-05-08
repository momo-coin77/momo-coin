// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Alert Component
import { AlertModule } from 'ngx-bootstrap/alert';

// Modal module
import { ModalModule } from 'ngx-bootstrap/modal';

// Notifications Routing


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParcelDetailComponent } from './parcel-detail/parcel-detail.component';
import { PassengerDetailComponent } from './passenger-detail/passenger-detail.component';
import { DetailComponent } from './detail.component';
import { DetailRoutingModule } from './detail-routing.module';
import { ConfirmPaymentComponent } from './payment/confirm-payment/confirm-payment.component';
import { WaitPaymentComponent } from './payment/wait-payment/wait-payment.component';
import { TransportComponent } from './transport/transport.component';


@NgModule({
    imports: [
      DetailRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      AlertModule.forRoot(),
      ModalModule.forRoot()
    ],
    declarations: [
      ParcelDetailComponent,
      PassengerDetailComponent,
      DetailComponent,
      ConfirmPaymentComponent,
      WaitPaymentComponent,
      TransportComponent
    ],
    exports:[
      DetailComponent
    ]
  })
export class DetailModule {

}
