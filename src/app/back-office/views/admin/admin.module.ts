// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatTabsModule } from '@angular/material';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SpinnerModule } from '../../../shared/components/spinner/spinner.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { AddPackComponent } from './packs/add-pack/add-pack.component';
import { ListsPackComponent } from './packs/lists-pack/lists-pack.component';
import { ListsUserComponent } from './users/lists-user/lists-user.component';
import { InputEmailSearchComponent } from './input-email-search/input-email-search.component';
import { ListUserComponent } from './list-user/list-user.component';
import { TabsModule } from '../../components/tabs/tabs.module';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),    
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatGridListModule,
    MatFormFieldModule,
    MatDividerModule,
    MatTabsModule,
    TabsModule
  ],
  declarations: [
    ListsUserComponent,
    AddPackComponent,
    ListsPackComponent,
    AdminComponent,
    InputEmailSearchComponent,
    ListUserComponent,
    
  ],
  exports:[
  ]
})
export class AdminModule { }
