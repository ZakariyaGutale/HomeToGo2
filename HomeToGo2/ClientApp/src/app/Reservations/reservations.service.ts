import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IReservation } from './reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private baseUrl = 'api/reservation';

  constructor(private http: HttpClient) { }

  getReservations(): Observable<IReservation[]> {
    return this.http.get<IReservation[]>(this.baseUrl);
  }

  createReservation(newReservation: IReservation): Observable<any> {
    const createUrl = 'api/reservation/createReservation';
    // Prepare the payload excluding the 'Listing' property
    const payload = {
      ReservationId: newReservation.ReservationId,
      ReservationDate: newReservation.ReservationDate,
      ListingId: newReservation.ListingId,
      CheckInDate: newReservation.CheckInDate,
      CheckOutDate: newReservation.CheckOutDate,
      TotalPrice: newReservation.TotalPrice
    };
    return this.http.post<any>(createUrl, payload);
  }



  deleteReservation(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
