// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { RegistrationRoutingModule } from './registration.routing.module';
import { ProgressIndeterminateModule } from '../../shared/components/progress-indeterminate/progress-indeterminate.module';


@NgModule({
  imports: [
    CommonModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    RegistrationRoutingModule,
    ProgressIndeterminateModule
  ],
  declarations: [
      RegisterComponent,
  ]
})
export class RegistrationModule { }
