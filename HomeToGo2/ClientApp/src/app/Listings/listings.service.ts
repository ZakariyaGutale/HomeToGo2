import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IListing } from './listing'

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private baseUrl = 'api/listing/';

  constructor(private _http: HttpClient) { }

  getListings(): Observable<IListing[]> {
    return this._http.get<IListing[]>(this.baseUrl);
  }

  // In listing.service.ts

  getListingById(listingId: number): Observable<IListing> {
    return this._http.get<IListing>(`api/listing/${listingId}`);
  }


  createListing(newListing: IListing): Observable<any> {
    const createUrl = 'api/listing/create';
    return this._http.post<any>(createUrl, newListing);
  }
}
