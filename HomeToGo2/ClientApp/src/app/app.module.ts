import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ListingsComponent } from './listings/listings.component';
import { ConvertToCurrency } from './shared/convert-to-currency.pipe';
import { ListingFormComponent } from './listings/listingform.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { ReservationFormComponent } from './reservations/reservationform.component';
import { LoginComponent } from './Authentication/login.component';
import {AuthService} from "./Authentication/auth.service";

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ListingsComponent,
    ConvertToCurrency,
    ListingFormComponent,
    ReservationsComponent,
    ReservationFormComponent,
    LoginComponent // Add LoginComponent to declarations
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
      { path: 'reservations', component: ReservationsComponent },
      { path: 'reservationform', component: ReservationFormComponent },
      { path: 'login', component: LoginComponent } // Add route for LoginComponent
    ])
  ],
  providers: [AuthService], // Add AuthService to providers
  bootstrap: [AppComponent]
})
export class AppModule { }
