// users.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { IUser } from './user';

@Component({
  selector: 'app-users', // Component's CSS selector
  templateUrl: './users.component.html', // HTML template file for this component
  styleUrls: ['./users.component.css'] // CSS styles specific to this component
})
export class UsersComponent implements OnInit {
  users: IUser[] = []; // Array to store user data

  // Constructor to inject AuthService for fetching user data
  constructor(private userService: AuthService) {}

  ngOnInit(): void {
    // Fetch users when the component initializes
    this.userService.getUsers().subscribe(
      (data) => this.users = data, // On successful fetch, assign data to the users array
      (error) => console.error('Failed to fetch users', error) // Log errors if fetch fails
    );
  }
}
