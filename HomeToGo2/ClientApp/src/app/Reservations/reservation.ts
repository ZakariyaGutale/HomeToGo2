import { IListing } from "../listings/listing";

export interface IReservation {
  ReservationId: number;
  ReservationDate: Date;
  ListingId: number;
  Listing?: IListing; // Make sure this matches the structure returned by the API
  CheckInDate: Date;
  CheckOutDate: Date;
  TotalPrice: number;
}
