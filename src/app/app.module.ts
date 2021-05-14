import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NguiMapModule} from '@ngui/map';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './back-office/containers';
import { LoginComponent } from './front-office/login/login.component';
import { RegisterComponent } from './front-office/register/register.component';


import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { UserService } from './shared/service/user/user.service';

// Angular Material Components
import { MatCheckboxModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

/////
import { RouterModule } from '@angular/router';
import { AppBootStrapModule } from './shared/app-boot-strap/app-boot-strap.module';
import { ToastrModule } from 'ngx-toastr';
// import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MDBBootstrapModule } from 'angular-bootstrap-md';


/// Front Office
import { NavBarComponent } from './front-office/static-elements/nav-bar/nav-bar.component';
import { FooterComponent } from './front-office/static-elements/footer/footer.component';
import { FullIntroComponent } from './front-office/static-elements/full-intro/full-intro.component';
import { WelcomeComponent } from './front-office/welcome/welcome.component';
import { HowDoesItWorkComponent } from './front-office/how-does-it-work/how-does-it-work.component';
import { RequestsComponent } from './front-office/requests/requests.component';
import { AboutUsComponent } from './front-office/about-us/about-us.component';
import { ForgotPasswordComponent } from './front-office/forgot-password/forgot-password.component';
import { ViewTripCarrierShipmentComponent } from './front-office/view-trip/view-trip-carrier-shipment/view-trip-carrier-shipment.component';
import { ViewTripTransportPersonsComponent } from './front-office/view-trip/view-trip-transport-persons/view-trip-transport-persons.component';
// import { RegisterCarrierShipperTransporterComponent } from './front-office/registration/register-carrier-shipper-transporter/register-carrier-shipper-transporter.component';

// Shared
import { BlankPageComponent } from './shared/blank-page/blank-page.component';
import { PrivacyPolicyComponent } from './shared/components/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './shared/components/terms-and-conditions/terms-and-conditions.component';

import { VerifyEmailComponent } from './front-office/verify-email/verify-email.component';
// import { ProgressIndeterminateComponent } from './shared/components/progress-indeterminate/progress-indeterminate.component';

import { ProgressIndeterminateModule } from './shared/components/progress-indeterminate/progress-indeterminate.module';
import { DetailService } from './shared/service/back-office/detail.service';
// import { UserlocalstorageService } from './shared/service/localstorage/userlocalstorage.service';

// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
// const config: SocketIoConfig = { url: 'http://localhost:8090', options: {} };
 import { environment } from '../environments/environment';
import { EventService } from './shared/service/event/event.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SpinnerModule } from './shared/components/spinner/spinner.module';

@NgModule({
  imports: [
    SpinnerModule,
    BrowserModule,
    BrowserAnimationsModule,
    // SocketIoModule.forRoot(config),
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    BrowserAnimationsModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=MY_GOOGLE_API_KEY'}),
    // ChatModule,
    ProgressIndeterminateModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      preventDuplicates: true
    }),
    RouterModule,

    // NgModule,
    AppBootStrapModule,
    NgbModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // material import
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatNativeDateModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ModalModule.forRoot(),
    SpinnerModule
  ],
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    LoginComponent,
    RegisterComponent,
    NavBarComponent,
    FooterComponent,
    FullIntroComponent,
    WelcomeComponent,
    VerifyEmailComponent,
    ForgotPasswordComponent,
    PrivacyPolicyComponent,
    AboutUsComponent,
    TermsAndConditionsComponent,
    HowDoesItWorkComponent,
    BlankPageComponent,
  ],
  providers: [
    {
    provide: LocationStrategy,
    useClass: HashLocationStrategy,
  },
  EventService,
  // UserService,
  // RealtimeService,
  // ChatRealtimeService,
  // DetailService,

],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
