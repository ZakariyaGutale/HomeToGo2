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
  today: string;
  threeDaysLater: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private reservationService: ReservationService,
    private listingService: ListingService
  ) {
    this.today = this.formatDate(new Date());
    this.threeDaysLater = this.formatDate(new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000));
    this.reservationForm = this.formBuilder.group({
      ListingId: ['', Validators.required],
      CheckInDate: [this.today, Validators.required],
      CheckOutDate: [this.threeDaysLater, Validators.required],
    }, { validators: this.dateRangeValidator });
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
    console.log("Reservation form submitted: ");
    console.log(this.reservationForm.value);
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

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Custom validator for checking date range
  private dateRangeValidator(group: FormGroup): { [key: string]: any } | null {
    const checkInDate = group.get('CheckInDate')?.value;
    const checkOutDate = group.get('CheckOutDate')?.value;

    // Check if both dates are filled and if check-out date is after check-in date
    if (checkInDate && checkOutDate && new Date(checkOutDate) <= new Date(checkInDate)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }
}
