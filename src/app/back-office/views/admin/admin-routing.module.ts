import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUserComponent } from './users/add-user/add-user.component';
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
                path: 'list-user',
                component: ListsUserComponent,
                data: {
                    title: 'User list'
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
