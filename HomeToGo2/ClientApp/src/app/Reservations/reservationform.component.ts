import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservationService } from './reservations.service';
import { IListing } from '../listings/listing';
import { ListingService } from '../listings/listings.service';

// Component decorator defining the selector and template for the reservation form
@Component({
  selector: "app-reservation-form",
  templateUrl: "./reservationform.component.html"
})
export class ReservationFormComponent implements OnInit {
  // Declaration of form group for handling reservation form inputs
  reservationForm: FormGroup;
  // Array to store listings fetched from the service
  listings: IListing[] = [];
  // Variables for default dates in the form
  today: string;
  threeDaysLater: string;

  constructor(
    private formBuilder: FormBuilder, // FormBuilder for building the form group
    private router: Router, // Router for navigating between components
    private reservationService: ReservationService, // Service for reservation operations
    private listingService: ListingService // Service for listing operations
  ) {
    // Setting default dates for the reservation form
    this.today = this.formatDate(new Date());
    this.threeDaysLater = this.formatDate(new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000));
    // Initializing the reservation form with validators
    this.reservationForm = this.formBuilder.group({
      ListingId: ['', Validators.required],
      CheckInDate: [this.today, Validators.required],
      CheckOutDate: [this.threeDaysLater, Validators.required],
    }, { validators: this.dateRangeValidator });
  }

  ngOnInit(): void {
    this.loadListings(); // Load listings when the component initializes
  }

  // Method to load listings using the ListingService
  loadListings(): void {
    this.listingService.getListings().subscribe({
      next: (listings) => this.listings = listings, // Assigning fetched listings to the local array
      error: (error) => console.error('Error loading listings', error) // Handling errors
    });
  }

  // Method to handle form submission
  onSubmit(): void {
    console.log("Reservation form submitted: ");
    console.log(this.reservationForm.value);
    const newReservation = this.reservationForm.value;
    // Creating a new reservation through the ReservationService
    this.reservationService.createReservation(newReservation)
      .subscribe({
        next: (response) => {
          console.log(response.message); // Logging response message
          this.router.navigate(['/reservations']); // Navigate to reservations page after creation
        },
        error: (error) => console.error('Reservation creation failed', error) // Handling errors
      });
  }

  // Method to navigate back to the reservations page
  backToReservations(): void {
    this.router.navigate(['/reservations']);
  }

  // Helper method to format date to a string
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Custom validator to ensure the date range is valid
  private dateRangeValidator(group: FormGroup): { [key: string]: any } | null {
    const checkInDate = group.get('CheckInDate')?.value;
    const checkOutDate = group.get('CheckOutDate')?.value;

    // Validation logic for checking the order of dates
    if (checkInDate && checkOutDate && new Date(checkOutDate) <= new Date(checkInDate)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }
}
