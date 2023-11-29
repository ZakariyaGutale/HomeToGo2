import { Component, OnInit } from '@angular/core';
import { IReservation } from './reservation';
import { ReservationService } from './reservations.service';
import { Router } from '@angular/router';
import { ListingService } from '../listings/listings.service';
import { IListing } from '../listings/listing';

@Component({
  selector: 'app-reservations-component',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  reservations: IReservation[] = [];

  constructor(
    private reservationService: ReservationService,
    private router: Router,
    private listingService: ListingService

  ) {}

  ngOnInit(): void {
    this.fetchReservations();
  }

  private fetchReservations(): void {
    this.reservationService.getReservations().subscribe(reservations => {
      this.reservations = reservations;
      this.reservations.forEach(reservation => {
        if (reservation.ListingId) {
          this.fetchListingForReservation(reservation);
        }
      });
    });
  }

  private fetchListingForReservation(reservation: IReservation): void {
    this.listingService.getListingById(reservation.ListingId).subscribe(
      (listing: IListing) => {
        reservation.Listing = listing;
      },
      error => {
        console.error('Error fetching listing for reservation:', error);
      }
    );
  }

  navigateToReservationForm(): void{
    this.router.navigate(['/reservationform']);
  }

}

