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


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ListingsComponent,
    ConvertToCurrency,
    ListingFormComponent,
    ListingsGridComponent,
    ListingDetailComponent
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
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

