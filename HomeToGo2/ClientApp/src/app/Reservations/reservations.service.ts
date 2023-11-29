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

  createReservation(reservation: IReservation): Observable<any> {
    const createUrl = 'api/reservation/createReservation'
    return this.http.post<any>(createUrl, reservation);
  }

  deleteReservation(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
