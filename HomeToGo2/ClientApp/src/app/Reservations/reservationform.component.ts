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
  overlapError: string = ''; // Error message for the overlap

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

    // Subscribe to form value changes
    this.reservationForm.valueChanges.subscribe(() => {
      // Call the overlap check function if the form fields are valid
      if (this.reservationForm.get('ListingId')?.valid &&
        this.reservationForm.get('CheckInDate')?.valid &&
        this.reservationForm.get('CheckOutDate')?.valid) {
        this.checkOverlap();
      }
    });
  }

  checkOverlap(): void {
    // Only send the necessary fields for overlap check
    const partialReservation = {
      ListingId: this.reservationForm.get('ListingId')?.value,
      CheckInDate: this.reservationForm.get('CheckInDate')?.value,
      CheckOutDate: this.reservationForm.get('CheckOutDate')?.value
    };

    this.reservationService.checkOverlap(partialReservation).subscribe({
      next: (isOverlap) => {
        if (isOverlap) {
          // If there is an overlap, set an error message
          this.overlapError = 'The selected dates are not available for this listing. Please choose different dates.';
        } else {
          // If there is no overlap, clear the error message
          this.overlapError = '';
        }
      },
      error: (error) => {
        // Handle server errors here
        console.error('Error checking reservation overlap:', error);
      }
    });
  }

  loadListings(): void {
    this.listingService.getListings().subscribe({
      next: (listings) => this.listings = listings,
      error: (error) => console.error('Error loading listings', error)
    });
  }

  onSubmit(): void {
    if(this.overlapError) {
      // If there is an overlap error, do not submit and alert the user
      alert(this.overlapError);
      return;
    }

    console.log("Reservation form submitted: ");
    console.log(this.reservationForm.value);
    const newReservation = this.reservationForm.value;
    this.reservationService.createReservation(newReservation)
      .subscribe({
        next: (response) => {
          console.log(response.message);
          this.router.navigate(['/reservations']);
        },
        error: (error) => {
          console.error('Reservation creation failed', error);
          this.overlapError = error.error || 'An error occurred while creating the reservation.';
        }
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
