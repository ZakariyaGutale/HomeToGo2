import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservationService } from './reservations.service';
import { IListing } from '../listings/listing';
import { ListingService } from '../listings/listings.service';
import { IReservation } from './reservation';

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
    this.listingService.getListings().subscribe(
      listings => this.listings = listings,
      error => console.error('Error loading listings:', error)
    );
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      const newReservation: IReservation = {
        ...this.reservationForm.value,
        ReservationDate: new Date(), // Server will set the reservation date
        TotalPrice: 0 // Server will calculate the total price
      };

      this.reservationService.createReservation(newReservation).subscribe(
        response => {
          console.log('Reservation created:', response);
          this.router.navigate(['/reservations']);
        },
        error => console.error('Reservation creation failed:', error)
      );
    } else {
      console.error('Form is not valid');
    }
  }

  backToReservations(): void {
    this.router.navigate(['/reservations']);
  }
}
