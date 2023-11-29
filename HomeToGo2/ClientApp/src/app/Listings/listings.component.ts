import { Component, OnInit } from '@angular/core';
import { IListing } from './listing';
import { Router } from '@angular/router';
import { ListingService } from './listings.service';

@Component({
  selector: 'app-listings-component',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit {
  viewTitle: String = 'Table';
  displayImage: boolean = true; // Controls whether to display images
  listings: IListing[] = []; // Array to store listing data

  // Filter-related properties
  private _listFilter: string = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    console.log('In setter:', value);
    this.filteredListings = this.performFilter(value);
  }

  filteredListings: IListing[] = this.listings; // Array to store filtered listings

  constructor(private _router: Router, private _listingService: ListingService) { }

  // Fetch listings from the service
  getListings(): void {
    this._listingService.getListings()
      .subscribe((data: IListing[]) => {
        console.log('All', JSON.stringify(data));
        this.listings = data;
        this.filteredListings = this.listings;
      });
  }

  // Filter listings based on the filter criteria
  performFilter(filterBy: string): IListing[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.listings.filter((listing: IListing) =>
      listing.Title.toLocaleLowerCase().includes(filterBy))
  }

  // Method to delete a listing
  deleteListing(listing: IListing): void {
    const confirmDelete = confirm(`Are you sure you want to delete "${listing.Title}"?`);
    if (confirmDelete) {
      this._listingService.deleteListing(listing.ListingId)
        .subscribe(
          (response) => {
            if (response.success) {
              console.log(response.message);
              this.filteredListings = this.filteredListings.filter(i => i !== listing);
            }
          },
          (error) => {
            console.error('Error deleting listing:', error);
          });
    }
  }

  // Toggle image display on the listing table
  toggleImage(): void {
    this.displayImage = !this.displayImage;
  }

  // Navigate to the listing form page
  navigateToListingForm() {
    this._router.navigate(['/listingform']);
  }

  ngOnInit(): void {
    // Fetch listings on component initialization
    this.getListings();
  }

  // Navigate to the detail view of a listing
  goToListingDetail(listingId: number): void {
    this._router.navigate(['/listingdetail', listingId]);
  }
}
