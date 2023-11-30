// Importing necessary Angular modules and interfaces
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IReservation } from './reservation';

// Injectable decorator to define this class as a service that can be injected
@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  // Base URL for the reservation API
  private baseUrl = 'api/reservation';

  // Constructor to inject the HttpClient service for making HTTP requests
  constructor(private http: HttpClient) { }

  // Method to get all reservations from the server
  getReservations(): Observable<IReservation[]> {
    // Uses HttpClient to send a GET request to the specified URL
    return this.http.get<IReservation[]>(this.baseUrl);
  }

  // Method to create a new reservation
  createReservation(reservation: IReservation): Observable<any> {
    // Specific URL for creating a reservation
    const createUrl = 'api/reservation/createReservation'
    // Uses HttpClient to send a POST request with the reservation data
    return this.http.post<any>(createUrl, reservation);
  }

  // Method to delete a reservation by its ID
  deleteReservation(id: number): Observable<any> {
    // Uses HttpClient to send a DELETE request to the URL with the reservation ID
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  //method to check if the dates overlaps
  checkOverlap(reservation: Partial<IReservation>): Observable<boolean> {
    const url = `${this.baseUrl}/checkOverlap`;
    return this.http.post<boolean>(url, reservation);
  }


}
