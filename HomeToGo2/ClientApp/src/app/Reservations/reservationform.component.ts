import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservationService } from './reservations.service';
import { IListing } from '../listings/listing';
import { ListingService } from '../listings/listings.service';

@Component({
  selector: "app-reservation-form",
  templateUrl: "./reservationform.component.html"
})
export class ReservationFormComponent implements OnInit {
  reservationForm: FormGroup;
  listings: IListing[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private reservationService: ReservationService,
    private listingService: ListingService
  ) {
    this.reservationForm = this.formBuilder.group({
      ListingId: ['', Validators.required],
      CheckInDate: ['', Validators.required],
      CheckOutDate: ['', Validators.required],

    });
  }

  ngOnInit(): void {
    this.loadListings();
  }

  loadListings(): void {
    this.listingService.getListings().subscribe({
      next: (listings) => this.listings = listings,
      error: (error) => console.error('Error loading listings', error)
    });
  }

  onSubmit(): void {
    console.log("Reservationcreate form submitted: ");
    console.log(this.reservationForm);
    const newReservation = this.reservationForm.value;
    this.reservationService.createReservation(newReservation)
      .subscribe({
        next: (response) => {
          console.log(response.message);
          this.router.navigate(['/reservations']);
        },
        error: (error) => console.error('Reservation creation failed', error)
      });
  }

  backToReservations(): void {
    this.router.navigate(['/reservations']);
  }
}
