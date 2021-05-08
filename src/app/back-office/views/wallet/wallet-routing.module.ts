import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepositComponent } from './deposit/deposit.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Wallet'
    },
    children: [
      {
        path: '',
        redirectTo: 'deposit'
      },
      {
        path: 'deposit',
        component: DepositComponent,
        data: {
          title: 'Deposit'
        }
      },
      {
        path: 'withdrawal',
        component: WithdrawalComponent,
        data: {
          title: 'Withdrawal'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletRoutingModule {}
