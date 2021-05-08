import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchLocationComponent } from './search-location.component';
import { MatChipsModule, MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ZoneService } from '../../../shared/service/zone/zone.service';
import {GeoDbFreeModule } from 'wft-geodb-angular-client';

@NgModule({
  declarations: [
    SearchLocationComponent
  ],
  imports: [FormsModule, ReactiveFormsModule, 
    
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatExpansionModule,
    MatIconModule,
    GeoDbFreeModule.forRoot({
      apiKey: null,
      serviceUri: "http://geodb-free-service.wirefreethought.com"
    })
  ],
  exports: [SearchLocationComponent],
  providers: [
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER, COMMA]
      }
    },
    ZoneService
  ]
})
export class SearchLocationModule { }
