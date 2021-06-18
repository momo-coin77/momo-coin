import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminerGuard } from '../../../shared/guard/adminer.guard';
import { UserManageGuard } from '../../../shared/guard/user-manage.guard';
import { AdminComponent } from './admin/admin.component';
import { AddPackComponent } from './packs/add-pack/add-pack.component';
import { ListsPackComponent } from './packs/lists-pack/lists-pack.component';
import { ListsUserComponent } from './users/lists-user/lists-user.component';

const routes: Routes = [
    {
        path: '',
        data: {
        },
        children: [
            {
                path: '',
                redirectTo: 'list-user'
            },
            {
                path: 'panel',
                canActivate: [AdminerGuard],
                component: AdminComponent,
                data: {
                    title: 'Admin Panel'
                }
                // canActivate:[AuthGuard]

            },
            {
                path: 'list-user',
                canActivate: [UserManageGuard],
                component: ListsUserComponent,
                data: {
                    title: 'User list'
                }
                // canActivate:[AuthGuard]

            },
            {
                path: 'list-pack',
                canActivate: [AdminerGuard],
                component: ListsPackComponent,
                data: {
                    title: 'List pack'
                }
                // canActivate:[AuthGuard]

            },
            {
                path: 'add-pack',
                canActivate: [AdminerGuard],
                component: AddPackComponent,
                data: {
                    title: 'Add pack'
                }
                // canActivate:[AuthGuard]

            },
            
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class AdminRoutingModule { }
