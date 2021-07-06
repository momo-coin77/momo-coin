import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminerGuard } from '../../../shared/guard/adminer.guard';
import { UserManageGuard } from '../../../shared/guard/user-manage.guard';
import { PacksPanelComponent } from './packs-panel/packs-panel.component';
import { AddPackComponent } from './packs/add-pack/add-pack.component';
import { ListsPackComponent } from './packs/lists-pack/lists-pack.component';
import { PanelComponent } from './panel/panel.component';
import { SettingsAdminComponent } from './settings-admin/settings-admin.component';
import { UserAdminPanel } from './user-admin-panel/user-admin-panel.component';
import { ListsUserComponent } from './users/lists-user/lists-user.component';

const routes: Routes = [
    {
        path: '',
        data: {
        },
        children: [
            {
                path: '',
                redirectTo: 'panel'
            },
            {
                path: 'panel',
                canActivate: [AdminerGuard],
                component: PanelComponent,
                data: {
                    title: 'Admin Panel'
                }
                // canActivate:[AuthGuard]

            },
            {
                path: 'user-panel',
                canActivate: [AdminerGuard],
                component: UserAdminPanel,
                data: {
                    title: 'Users Panel'
                }
                // canActivate:[AuthGuard]

            },
            {
                path: 'packs-panel',
                canActivate: [AdminerGuard],
                component: PacksPanelComponent,
                data: {
                    title: 'Packs Panel'
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
                path: 'setting-panel',
                canActivate: [AdminerGuard],
                component: SettingsAdminComponent,
                data: {
                    title: 'Settings'
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
