import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // Example properties (replace or remove based on actual usage)
  title: string = 'Welcome to HomeToGo';
  featuredRentals: string = 'Featured Rentals';

  // Example for future dynamic content loading
  carouselImages: string[] = [];
  testimonials: string[] = [];

  constructor() { }

  ngOnInit(): void {
    // Load dynamic content here (e.g., fetch data from a service)
    this.loadCarouselImages();
    this.loadTestimonials();
  }

  // Example methods for future data loading
  loadCarouselImages(): void {
    // Placeholder for actual data fetching logic
    this.carouselImages = [
      'assets/images/Ap1.jpg',
      'assets/images/Ap5.jpg',
      'assets/images/Ap2.jpg'
    ];
  }

  loadTestimonials(): void {
    // Placeholder for actual data fetching logic
    this.testimonials = [
      '"Booking with HomeToGo was a breeze. The host was friendly, the home was cozy..." - Sarah M.'
      // Add more testimonials here
    ];
  }
}
