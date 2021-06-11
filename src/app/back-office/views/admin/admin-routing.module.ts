import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminerGuard } from '../../../shared/guard/adminer.guard';
import { AdminComponent } from './admin/admin.component';
import { AddPackComponent } from './packs/add-pack/add-pack.component';
import { ListsPackComponent } from './packs/lists-pack/lists-pack.component';
import { ListsUserComponent } from './users/lists-user/lists-user.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AdminerGuard],
        data: {
        },
        children: [
            {
                path: '',
                redirectTo: 'list-user'
            },
            {
                path: 'panel',
                component: AdminComponent,
                data: {
                    title: 'Admin Panel'
                }
                // canActivate:[AuthGuard]

            },
            {
                path: 'list-user',
                component: ListsUserComponent,
                data: {
                    title: 'User list'
                }
                // canActivate:[AuthGuard]

            },
            {
                path: 'list-pack',
                component: ListsPackComponent,
                data: {
                    title: 'List pack'
                }
                // canActivate:[AuthGuard]

            },
            {
                path: 'add-pack',
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
