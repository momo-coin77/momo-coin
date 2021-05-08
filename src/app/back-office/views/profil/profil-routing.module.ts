import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Profil'
    },
    children: [
      {
        path: '',
        redirectTo: 'user'
      },
      {
        path: 'user',
        component: UserComponent,
        data: {
          title: 'User'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilRoutingModule {}
