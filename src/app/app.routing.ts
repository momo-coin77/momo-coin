import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './back-office/containers';

/// Front Office
import { HowDoesItWorkComponent } from './front-office/how-does-it-work/how-does-it-work.component';
import { ForgotPasswordComponent } from './front-office/forgot-password/forgot-password.component';
import { LoginComponent } from './front-office/login/login.component';
// import { RegisterComponent } from './front-office/registration/register.component';

// Shared
import { BlankPageComponent } from './shared/blank-page/blank-page.component';
import { PrivacyPolicyComponent } from './shared/components/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './shared/components/terms-and-conditions/terms-and-conditions.component';

//// Back Office
import { RegistrationComponent } from './front-office/registration/registration.component';
import { AuthGuard } from './shared/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'how-does-it-work',
    component: HowDoesItWorkComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signin',
    component: LoginComponent,
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./back-office/views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'profil',
        loadChildren: () => import('./back-office/views/profil/profil.module').then(m => m.ProfilModule)
      },
      {
        path: 'market',
        loadChildren: () => import('./back-office/views/market/market.module').then(m => m.MarketModule)
      },
      {
        path: 'sales',
        loadChildren: () => import('./back-office/views/sales/sales.module').then(m => m.SalesModule)
      },
      {
        path: 'purchases',
        loadChildren: () => import('./back-office/views/purchases/purchases.module').then(m => m.PurchasesModule)
      },
      {
        path: 'history',
        loadChildren: () => import('./back-office/views/history/history.module').then(m => m.HistoryModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./back-office/views/admin/admin.module').then(m => m.AdminModule)
      },
    ]
  },
  {
    path: '',
    component: RegistrationComponent,
    data: {
      title: 'Registration'
    },
    children: [
      {
        path: 'registration',
        loadChildren: () => import('./front-office/registration/registration.module').then(m => m.RegistrationModule)
      },
      {
        path: 'register',
        loadChildren: () => import('./front-office/registration/registration.module').then(m => m.RegistrationModule)
      },
      {
        path: 'signup',
        loadChildren: () => import('./front-office/registration/registration.module').then(m => m.RegistrationModule)
      },
    ]
  },
  {
    path: '**',
    component: BlankPageComponent
  },
  {
    path: 'blanck',
    component: BlankPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
