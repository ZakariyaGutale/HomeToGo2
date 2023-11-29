import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ListingsComponent } from './listings/listings.component';
import { ConvertToCurrency } from './Shared/convert-to-currency.pipe';
import { ListingFormComponent } from './Listings/listingform.component';
import { ListingsGridComponent } from './Listings/listingsgrid.component';
import { ListingDetailComponent } from './Listings/listingdetail.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { ReservationFormComponent } from './reservations/reservationform.component';
import { LoginComponent } from './Authentication/login.component';
import { RegisterComponent } from './Authentication/register.component'; // Import RegisterComponent
import { AuthService } from "./Authentication/auth.service";

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ListingsComponent,
    ConvertToCurrency,
    ListingFormComponent,
    ListingsGridComponent,
    ListingDetailComponent,
    ReservationsComponent,
    ReservationFormComponent,
    LoginComponent, // LoginComponent is already here
    RegisterComponent // Add RegisterComponent to declarations
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'listings', component: ListingsComponent },
      { path: 'listingform', component: ListingFormComponent },
      { path: 'listingform/:mode/:id', component: ListingFormComponent },
      { path: 'listingsgrid', component: ListingsGridComponent },
      { path: 'listingdetail/:id', component: ListingDetailComponent },
      { path: 'reservations', component: ReservationsComponent },
      { path: 'reservationform', component: ReservationFormComponent },
      { path: 'login', component: LoginComponent }, // Login route
      { path: 'register', component: RegisterComponent }, // Add route for RegisterComponent
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ])
  ],
  providers: [AuthService], // AuthService is already provided
  bootstrap: [AppComponent]
})
export class AppModule { }
