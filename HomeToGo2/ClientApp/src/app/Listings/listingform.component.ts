import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from './listings.service';

// Component decorator defining the selector and template for the listing form
@Component({
  selector: "app-listings-listingform",
  templateUrl: "./listingform.component.html"
})
export class ListingFormComponent {
  // FormGroup to handle form controls
  listingForm: FormGroup;
  // Flags to determine if the form is in edit mode and to store listing ID
  isEditMode: boolean = false;
  listingId: number = -1;

  constructor(
    private _formbuilder: FormBuilder, // FormBuilder to create a reactive form
    private _router: Router, // Router for navigating between components
    private _route: ActivatedRoute, // ActivatedRoute to access route parameters
    private _listingService: ListingService // Service for listing operations
  ) {
    // Initializing the form with controls and validators
    this.listingForm = _formbuilder.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      address: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      price: ['', [Validators.required, Validators.min(1)]],
      description: [''],
      imageUrl: ['']
    });
  }

  // Method to handle form submission
  onSubmit() {
    console.log("ListingCreate form submitted:");
    console.log(this.listingForm);
    const newListing = this.listingForm.value;
    // Check if it's edit mode or create mode
    if (this.isEditMode) {
      // Update the listing if in edit mode
      this._listingService.updateListing(this.listingId, newListing)
        .subscribe(response => {
          // Handle the response after update
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
      // Create a new listing if in create mode
      this._listingService.createListing(newListing)
        .subscribe(response => {
          // Handle the response after creation
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

  // Method to navigate back to the listings page
  backToListings() {
    this._router.navigate(['/listings']);
  }

  // ngOnInit lifecycle hook to perform component initialization
  ngOnInit(): void {
    this._route.params.subscribe(params => {
      // Determine if the form is in create or edit mode based on route parameters
      if (params['mode'] === 'create') {
        this.isEditMode = false;
      } else if (params['mode'] === 'edit') {
        this.isEditMode = true;
        this.listingId = +params['id']; // Convert id to number
        // Load the listing details if in edit mode
        this.loadListingForEdit(this.listingId);
      }
    });
  }

  // Method to handle responses from the server after create/update operations
  handleResponse(response: any, operation: string) {
    if (response.success) {
      console.log(`Listing ${operation} successful:`, response.message);
      this._router.navigate(['/listings']);
    } else {
      console.error(`Listing ${operation} failed:`, response.message);
    }
  }

  // Method to load a listing for editing
  loadListingForEdit(listingId: number) {
    // Fetch the listing details from the server
    this._listingService.getListingById(listingId)
      .subscribe(
        (listing: any) => {
          console.log('retrived listing: ', listing);
          // Update the form with the retrieved listing data
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
