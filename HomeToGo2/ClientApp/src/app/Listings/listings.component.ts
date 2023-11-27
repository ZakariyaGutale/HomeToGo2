
import { Component, OnInit } from '@angular/core';
import { IListing } from './listing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ListingService } from './listings.service';

@Component({
  selector: 'app-listings-component',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})

export class ListingsComponent {
  viewTitle: String = 'Table';
  displayImage: boolean = true;
  listings: IListing[] = [];

  constructor(private _router: Router, private _listingService: ListingService) { }

  private _listFilter: string = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    console.log('In setter:', value);
    this.filteredListings = this.performFilter(value);
  }

  getListings(): void {
    this._listingService.getListings()
      .subscribe((data: IListing[]) => {  // Explicitly declare data as type IListing[]
        console.log('All', JSON.stringify(data));
        this.listings = data;
        this.filteredListings = this.listings;
      }
      );
  }

  
  filteredListings: IListing[] = this.listings;

  performFilter(filterBy: string): IListing[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.listings.filter((listing: IListing) =>
      listing.Title.toLocaleLowerCase().includes(filterBy))
    
  }

   toggleImage(): void {
    this.displayImage = !this.displayImage;
   }

  navigateToListingForm() {
    this._router.navigate(['/listingform']);
  }
}
