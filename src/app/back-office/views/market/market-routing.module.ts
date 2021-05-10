import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketComponent } from './market/market.component';
import { WaitComponent } from './wait/wait.component';

const routes: Routes = [
  {
    path: '',
    data: {
    },
    children: [
      {
        path: '',
        redirectTo: 'open'
      },
      {
        path: 'open',
        component: MarketComponent,
        data: {
          title: 'market'
        }
      },
      {
        path: 'wait',
        component: WaitComponent,
        data: {
          title: 'Wait Opening'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketRoutingModule { }
