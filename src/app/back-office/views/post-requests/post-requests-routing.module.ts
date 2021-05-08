import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostRequestColisComponent } from './post-request-colis/post-request-colis.component';
import { PostRequestColis0Component } from './post-request-colis/post-request-colis0/post-request-colis0.component';
import { PostRequestColis1Component } from './post-request-colis/post-request-colis1/post-request-colis1.component';
import { PostRequestTripsComponent } from './post-request-trip/post-request-trips.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Post Requests'
    },
    children: [
      {
        path: '',
        redirectTo: 'packages'
      },
      {
        path: 'packages',
        component: PostRequestColisComponent,
        data: {
          title: 'Parcel'
        },
        children:[
          {
            path:'',
            redirectTo:'add'
          },
          {
            path: 'add',
            component:PostRequestColis0Component,
            pathMatch:'full'
          },
          {
            path: 'list-providers',
            component:PostRequestColis1Component,
            pathMatch:'full'
          },
        ]
      },
      {
        path: 'trips',
        component: PostRequestTripsComponent,
        data: {
          title: 'Trips'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostRequestsRoutingModule {}
