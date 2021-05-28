// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SpinnerModule } from '../../../shared/components/spinner/spinner.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AddPackComponent } from './packs/add-pack/add-pack.component';
import { EditPackComponent } from './packs/edit-pack/edit-pack.component';
import { ListsPackComponent } from './packs/lists-pack/lists-pack.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import { ListsUserComponent } from './users/lists-user/lists-user.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule
  ],
  declarations: [
    ListsUserComponent,
    AddUserComponent,
    AddPackComponent,
    ListsPackComponent,
    EditPackComponent,
    AdminComponent
    
  ]
})
export class AdminModule { }
