import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IListing } from './listing';
import { ListingService } from './listings.service';

@Component({
  selector: 'app-listing-detail',
  templateUrl: './listingdetail.component.html',
  styleUrls: ['./listingdetail.component.css']
})
export class ListingDetailComponent implements OnInit {
  listing!: IListing;


  constructor(
    private route: ActivatedRoute,
    private listingService: ListingService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      const id = +idParam;
      this.listingService.getListingById(id).subscribe(
        (data: IListing) => {
          this.listing = data;
        },
        error => {
          console.error('Error fetching listing details', error);
        }
      );
    } else {
      // Handle the case where ID is null, perhaps redirect back or show an error message
      console.error('No listing ID provided in the route.');
    }
  }



}
