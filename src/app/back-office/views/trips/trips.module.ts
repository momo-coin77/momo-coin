import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { TripsComponent } from './trips.component';
import { SettingsComponent } from './settings/settings.component';

// Dropdowns Component
import { VehiclesComponent } from './vehicles/vehicles.component';

// Trips Routing
import { TripsRoutingModule } from './trips-routing.module';

// Angular

@NgModule({
  imports: [
    CommonModule,
    TripsRoutingModule,
    FormsModule
  ],
  declarations: [
    TripsComponent,
    VehiclesComponent,
    SettingsComponent,
  ]
})
export class TripsModule { }
