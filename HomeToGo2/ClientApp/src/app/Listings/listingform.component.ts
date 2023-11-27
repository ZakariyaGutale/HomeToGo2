import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { ListingService } from './listings.service';

@Component({
  selector: "app-listings-listingform",
  templateUrl: "./listingform.component.html"
})
export class ListingFormComponent {
  listingForm: FormGroup;

  constructor(private _formbuilder: FormBuilder, private _router: Router, private _listingService: ListingService) {
    this.listingForm = _formbuilder.group({
      title: ['', Validators.required],
      address: ['', Validators.required],
      price: ['', Validators.required],
      description: [''],
      imageUrl: ['']
    })
  }


  onSubmit() {
    console.log("ListingCreate form submitted: ");
    console.log(this.listingForm);
    const newListing = this.listingForm.value;
    const createUrl = "api/listing/create";
    this._listingService.createListing(newListing)
      .subscribe(response => {
      if (response.success) {
        console.log(response.message);
        this._router.navigate(['/listings']);
      }
      else {
        console.log('Listing creation failed');
      }
    })
  
  }

  backToListings() {
    this._router.navigate(['/listings']);
  }
}