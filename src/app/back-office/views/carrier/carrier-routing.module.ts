import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehiclesComponent } from './vehicles/vehicles.component';
import { SettingsComponent } from './settings/settings.component';
import { BeProviderComponent } from './be-provider/be-provider.component';
import { CarrierGuard } from './../../../shared/guard/carrier.guard';
import { WaitAcceptanceComponent } from './wait-acceptance/wait-acceptance.component';
import { BeProviderFormComponent } from './be-provider-form/be-provider-form.component';
import { BeCarrierGuardGuard } from '../../../shared/guard/be-carrier-guard.guard';
import { BeProviderFormGuardGuard } from '../../../shared/guard/be-provider-form-guard.guard';
import { WaitAcceptanceGuardGuard } from '../../../shared/guard/wait-acceptance-guard.guard';
import { VehiclesGuardGuard } from '../../../shared/guard/vehicles-guard.guard';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Carrier'
    },
    children: [
      // {
      //   path: '',
      //   redirectTo: 'be-carrier'
      // },
      {
        path: 'be-carrier',
        canActivate:[BeCarrierGuardGuard],
        component: BeProviderComponent,
        data: {
          title: 'Become carrier',
          page:'become-provider'
        },
      },
      {
        path: 'be-provider-form',
        canActivate:[BeProviderFormGuardGuard],
        component: BeProviderFormComponent,
        data: {
          title: 'Become carrier form',
          page:"provider-form"
        }
      },
      {
        path: 'wait-acceptance',
        component: WaitAcceptanceComponent,
        canActivate:[WaitAcceptanceGuardGuard],
        data: {
          title: 'Wait acceptance'
        },
      },
      
      {
        path: 'vehicles',
        component: VehiclesComponent,
        data: {
          title: 'Vehicles'
        },
         canActivate: [VehiclesGuardGuard]
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: {
          title: 'Settings'
        },
        // canActivate: [CarrierGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarrierRoutingModule { }
