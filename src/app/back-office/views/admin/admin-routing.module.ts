import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminerGuard } from '../../../shared/guard/adminer.guard';
import { AddPackComponent } from './packs/add-pack/add-pack.component';
import { EditPackComponent } from './packs/edit-pack/edit-pack.component';
import { ListsPackComponent } from './packs/lists-pack/lists-pack.component';
import { AddUserComponent } from './users/add-user/add-user.component';
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
            {
                path: 'edit-pack',
                component: EditPackComponent,
                data: {
                    title: 'Edit pack'
                }
                // canActivate:[AuthGuard]

            },
            {
                path: 'add-user',
                component: AddUserComponent,
                data: {
                    title: 'Add user'
                }
                // canActivate:[AuthGuard]

            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class AdminRoutingModule { }
