import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchasesComponent } from './purchases/purchases.component';

const routes: Routes = [
  {
    path: '',
    component: PurchasesComponent,
    data: {
      title: 'purchases'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesRoutingModule { }
