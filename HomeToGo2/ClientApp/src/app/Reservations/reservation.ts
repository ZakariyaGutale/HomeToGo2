import {IListing} from "../listings/listing";

export interface IReservation {
  ReservationId?: number;
  ReservationDate?: Date;
  ListingId: number;
  Listing?: IListing;
  CheckInDate: Date;
  CheckOutDate: Date;
  TotalPrice?: number;
}




