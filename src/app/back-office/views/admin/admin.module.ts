// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AdminRoutingModule } from './admin-routing.module';
import { AddUserComponent } from './users/add-user/add-user.component';
import { ListsUserComponent } from './users/lists-user/lists-user.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
  ],
  declarations: [
    ListsUserComponent,
    AddUserComponent
  ]
})
export class AdminModule { }