// Importing Angular core components, router, reservation interface, and reservation service
import { Component, OnInit } from '@angular/core';
import { IReservation } from './reservation';
import { Router } from '@angular/router';
import { ReservationService } from './reservations.service';

// Component decorator to define metadata including the selector, HTML, and CSS
@Component({
  selector: 'app-reservations-component',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  // Variables for component state
  viewTitle: string = 'Table'; // Title of the view
  displayImage: boolean = true; // Flag to control image display
  reservations: IReservation[] = []; // Array to hold reservation data

  // Constructor to inject dependencies
  constructor(private _router: Router, private _ReservationService: ReservationService) { }

  // ngOnInit lifecycle hook to perform component initialization
  ngOnInit(): void {
    this.getReservations(); // Fetching reservations on component initialization
  }

  // Method to retrieve reservations from the service
  getReservations(): void {
    this._ReservationService.getReservations()
      .subscribe((data: IReservation[]) => {
        console.log('All', JSON.stringify(data)); // Logging fetched data
        this.reservations = data; // Assigning fetched reservations to the component state
        console.log('Fetched Reservations:', this.reservations); // Logging reservations
      });
  }

  // Method to toggle the display of images
  toggleImage(): void {
    this.displayImage = !this.displayImage;
  }

  // Method to navigate to the reservation form
  navigateToReservationForm() {
    this._router.navigate(['/reservationform']); // Using router to navigate
  }

  // Method to delete a reservation
  deleteReservation(id: number): void {
    // Confirm dialog to ensure intentional deletion
    if (confirm('Are you sure you want to delete this reservation?')) {
      this._ReservationService.deleteReservation(id).subscribe(() => {
        // Updating the reservations array by filtering out the deleted reservation
        this.reservations = this.reservations.filter(reservation => reservation.ReservationId !== id);
      });
    }
  }
}
