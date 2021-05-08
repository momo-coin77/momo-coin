// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DepositComponent } from './deposit/deposit.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';

// Wallet Routing
import { WalletRoutingModule } from './wallet-routing.module';
import { PaymentModule } from '../../../shared/components/payment/payment.module';

@NgModule({
  imports: [
    PaymentModule,
    CommonModule,
    WalletRoutingModule,
    AlertModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [
    DepositComponent,
    WithdrawalComponent,
  ]
})
export class WalletModule { }
