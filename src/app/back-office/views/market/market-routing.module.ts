import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketPlaceComponent } from './market-place.component';

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
        redirectTo: 'market-place'
      },
      {
        path: 'market-place',
        component: MarketPlaceComponent,
        data: {
          title: 'market'
        }
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
