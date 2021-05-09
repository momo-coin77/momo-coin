// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MarketComponent } from './market/market.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';

// market Routing
import { MarketRoutingModule } from './market-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MarketRoutingModule,
    AlertModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [
    MarketComponent,
  ]
})
export class MarketModule { }
