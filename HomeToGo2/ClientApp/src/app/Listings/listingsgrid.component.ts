import { Component, OnInit } from '@angular/core';
import { IListing } from './listing';
import { ListingService } from './listings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listingsgrid',
  templateUrl: './listingsgrid.component.html',
  styleUrls: ['./listingsgrid.component.css']
})
export class ListingsGridComponent implements OnInit {
  listings: IListing[] = [];
  sortedListings: IListing[] = [];

  constructor(private listingService: ListingService, private _router: Router) { }

  ngOnInit(): void {
    //fetched all listings when the component initializes.
    this.fetchListings();
  }

  fetchListings(): void {
    //subscribed to the Observable returned by the getListings method.
    this.listingService.getListings().subscribe(
      (data: IListing[]) => {
        this.listings = data;
        this.sortedListings = [...this.listings]; // Initialize sortedListings
      },
      error => {
        console.error('Error fetching listings', error);
      }
    );
  }

  sortListings(event: Event): void {
    //sorted the listings based on the selected sort option.
    const selectElement = event.target as HTMLSelectElement;
    const sortOption = selectElement.value;

    switch (sortOption) {
      case 'priceAsc':
        this.sortedListings = [...this.listings].sort((a, b) => a.Price - b.Price);
        break;
      case 'priceDesc':
        this.sortedListings = [...this.listings].sort((a, b) => b.Price - a.Price);
        break;
      case 'titleAsc':
        this.sortedListings = [...this.listings].sort((a, b) => a.Title.localeCompare(b.Title));
        break;
      case 'titleDesc':
        this.sortedListings = [...this.listings].sort((a, b) => b.Title.localeCompare(a.Title));
        break;
    }
  }

  goToListingDetail(listingId: number): void {
    this._router.navigate(['/listingdetail', listingId]);
  }
}
