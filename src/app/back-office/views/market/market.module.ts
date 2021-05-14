// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MarketComponent } from './market/market.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';

// market Routing
import { MarketRoutingModule } from './market-routing.module';
import { WaitComponent } from './wait/wait.component';
import { MarketPlaceComponent } from './market-place.component';
import { ConfirmPackComponent } from './confirm-pack/confirm-pack.component';
import { SpinnerModule } from '../../../shared/components/spinner/spinner.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MarketRoutingModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    SpinnerModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    MarketComponent,
    WaitComponent,
    MarketPlaceComponent,
    ConfirmPackComponent
  ]
})
export class MarketModule { }
