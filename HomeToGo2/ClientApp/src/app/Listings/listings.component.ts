
import { Component } from '@angular/core';

@Component({
  selector: 'app-listings-component',
  templateUrl: './listings.component.html',
})

export class ListingsComponent {
  viewTitle: String = 'Table';
  displayImage: boolean = true;
  listings: any[] = [

    {

    "ListingId": 1,
    "Title": "Tjuvholmen Penthouse",
    "Adress": "Osloveien 36",
    "Price": 200,
    "Description": "This apartment at Tjuvholmen impresses with its modern style and exclusive location, right by Oslo’s waterfront",
    "ImageUrl": "assets/Images/Ap1.jpg"
    },

    {
    "ListingId": 2,
    "Title": "Modern Apartment in Pilestredet",
    "Adress": "Pilistredet 32",
    "Price": 200,
    "Description": "This modern apartment in Pilestredet is perfect for those who wish to live centrally in Oslo.",
    "ImageUrl": "assets/Images/Ap2.jpg"
    },

     {
    "ListingId": 3,
    "Title": "Montebello, Villa",
    "Adress": "Montebello gate 1",
    "Price": 2500,
    "Description": "This spacious villa in Montebello combines luxury and comfort..",
    "ImageUrl": "assets/Images/Ap4.jpg"
    },

    {
    "ListingId": 4,
    "Title": "Frogener, Hageby",
    "Adress": "Frogner Veien 43",
    "Price": 1600,
    "Description": "Single-family homes in Frogner Hageby in Oslo are renowned for their idyllic and lush atmosphere.",
    "ImageUrl": "assets/Images/Ap5.jpg"
    },

     {
    "ListingId": 5,
    "Title": "Zanzibar, Beach house",
    "Adress": "Zanzi 73",
    "Price": 3500,
    "Description": "This beach house in Zanzibar offers stunning ocean views, perfect for a relaxing holiday..",
    "ImageUrl": "assets/Images/Ap6.jpg"
    }
    
  ];

   toggleImage(): void {
    this.displayImage = !this.displayImage;
  }
}
