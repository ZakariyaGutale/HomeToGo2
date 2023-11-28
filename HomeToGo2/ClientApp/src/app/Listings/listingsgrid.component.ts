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
  listings: IListing[] = []; // Array to store listings

  constructor(private listingService: ListingService, private _router: Router) { }

  ngOnInit(): void {
    this.fetchListings();
  }

  fetchListings(): void {
    this.listingService.getListings().subscribe(
      (data: IListing[]) => {
        this.listings = data;
      },
      error => {
        console.error('Error fetching listings', error);
      }
    );
  }

  goToListingDetail(listingId: number): void {
    this._router.navigate(['/listingdetail', listingId]);
  }
}
