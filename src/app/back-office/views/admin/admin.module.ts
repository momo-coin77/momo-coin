// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule, MatDialogModule, MatDividerModule, MatExpansionModule, MatFormFieldModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatPaginatorModule, MatTableModule, MatTabsModule } from '@angular/material';
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
import { UserProfilComponent } from './user-profil/user-profil.component';
import { UserPacksComponent } from './user-packs/user-packs.component';
import { UserPacksListComponent } from './user-packs-list/user-packs-list.component';
import { CdkTableModule } from '@angular/cdk/table';
import { UserAddPackComponent } from './user-add-pack/user-add-pack.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserTransferPackComponent } from './user-transfer-pack/user-transfer-pack.component';

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
    TabsModule,
    MatExpansionModule,
    CdkTableModule,
    MatPaginatorModule,
    MatTableModule,
    MatDialogModule,
    NgbModule
  ],
  declarations: [
    ListsUserComponent,
    AddPackComponent,
    ListsPackComponent,
    AdminComponent,
    InputEmailSearchComponent,
    ListUserComponent,
    UserProfilComponent,
    UserPacksComponent,
    UserPacksListComponent,
    UserAddPackComponent,
    UserTransferPackComponent,       
  ],
  exports:[
  ],
  entryComponents:[
    UserAddPackComponent,
    UserTransferPackComponent
  ]
})
export class AdminModule { }
