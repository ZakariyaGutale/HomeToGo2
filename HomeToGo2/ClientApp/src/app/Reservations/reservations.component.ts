import { Component, OnInit } from '@angular/core';
import { IReservation } from './reservation';
import { Router } from '@angular/router';
import { ReservationService } from './reservations.service';

@Component({
  selector: 'app-reservations-component',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  viewTitle: string = 'Table';
  displayImage: boolean = true;
  reservations: IReservation[] = [];

  constructor(private _router: Router, private _ReservationService: ReservationService) { }

  ngOnInit(): void {
    this.getReservations();
  }
  getReservations(): void {
    this._ReservationService.getReservations()
      .subscribe((data: IReservation[]) => {
        console.log('All', JSON.stringify(data));
        this.reservations = data; // Corrected variable name
        console.log('Fetched Reservations:', this.reservations);
      });
  }


  toggleImage(): void {
    this.displayImage = !this.displayImage;
  }

  navigateToReservationForm() {
    this._router.navigate(['/reservationform']);
  }

  deleteReservation(id: number): void {
    if (confirm('Are you sure you want to delete this reservation?')) {
      this._ReservationService.deleteReservation(id).subscribe(() => {
        // Refresh the list or remove the item from the array
        this.reservations = this.reservations.filter(reservation => reservation.ReservationId !== id);
      });
    }
  }

}
