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
    //call to get all listings
    return this._http.get<IListing[]>(this.baseUrl);
  }

  createListing(newListing: IListing): Observable<any> {
    //method for creating a url-listing
    const createUrl = 'api/listing/create';
    return this._http.post<any>(createUrl, newListing);
  }
  getListingById(listingId: number): Observable<any> {
    //Method to get a listing by an id, used by update , delete etc.
    const url = `${this.baseUrl}/${listingId}`;
    return this._http.get(url);
  }

  updateListing(listingId: number, newListing: any): Observable<any> {
    //contructs the url for update a specific listing
    const url = `${this.baseUrl}/update/${listingId}`;
    newListing.listingId = listingId;
    return this._http.put<any>(url, newListing);
  }

  deleteListing(listingId: number): Observable<any> {
    //contructs the url for deleting a specific listing
    const url = `${this.baseUrl}/delete/${listingId}`;
    return this._http.delete(url);
  }
}
