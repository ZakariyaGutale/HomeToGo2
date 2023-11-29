import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from './listings.service';

@Component({
  selector: "app-listings-listingform",
  templateUrl: "./listingform.component.html"
})
export class ListingFormComponent {
  listingForm: FormGroup;
  isEditMode: boolean = false;
  listingId: number = -1;

  constructor(
    private _formbuilder: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _listingService: ListingService
  ) {
    this.listingForm = _formbuilder.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      address: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      price: ['', [Validators.required, Validators.min(1)]],
      description: [''],
      imageUrl: ['']
    });
  }

  onSubmit() {
    console.log("ListingCreate form submitted:");
    console.log(this.listingForm);
    const newListing = this.listingForm.value;
    if (this.isEditMode) {
      this._listingService.updateListing(this.listingId, newListing)
        .subscribe(response => {
          if (response.success) {
            console.log(response.message);
            this._router.navigate(['/listings']);
          }
          else {
            console.log('Listing update failed');
          }
        });
    }
    else {
      this._listingService.createListing(newListing)
        .subscribe(response => {
          if (response.success) {
            console.log(response.message);
            this._router.navigate(['/listings']);
          }
          else {
            console.log('Listing creation failed');
          }
        });
    }
  }

  backToListings() {
    this._router.navigate(['/listings']);
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      if (params['mode'] === 'create') {
        this.isEditMode = false; // Create mode
      } else if (params['mode'] === 'edit') {
        this.isEditMode = true; // Edit mode
        this.listingId = +params['id']; // Convert to number
        this.loadListingForEdit(this.listingId);
      }
    });
  }

  loadListingForEdit(listingId: number) {
    this._listingService.getListingById(listingId)
      .subscribe(
        (listing: any) => {
          console.log('retrived listing: ', listing);
          this.listingForm.patchValue({
            title: listing.Title,
            address: listing.Address,
            price: listing.Price,
            description: listing.Description,
            imageUrl: listing.ImageUrl
          });
        },
        (error: any) => {
          console.error('Error loading listing for edit:', error);
        }
      );
  }

}
