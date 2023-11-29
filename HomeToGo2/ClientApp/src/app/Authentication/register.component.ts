import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email: string = '';
  username: string = ''; // Add username
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  // Inject AuthService and Router for handling registration and navigation
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Lifecycle hook for initialization, can be used for additional setup
  }

  register() {
    // Reset error and success messages
    this.errorMessage = '';
    this.successMessage = '';
    // Set loading status to true
    this.isLoading = true;

    // Check if password and confirm password fields match
    if (this.password !== this.confirmPassword) {
      this.isLoading = false;
      this.errorMessage = 'Passwords do not match';
      return;
    }

    // Call AuthService's register method with email, username, and password
    this.authService.register(this.email, this.username, this.password).subscribe(
      response => {
        // On successful registration, display a success message and automatically log in the user
        this.successMessage = 'Registration successful!';
        this.loginAfterRegister(); // Call the login function after successful registration
      },
      error => {
        // Handle errors and display message to the user
        this.isLoading = false;
        this.errorMessage = error.error.message || 'Registration failed';
      }
    );
  }

  // Private method to automatically log in the user after successful registration
  private loginAfterRegister() {
    this.authService.login(this.username, this.password).subscribe(
      success => {
        // Navigate to the home or dashboard page after successful login
        this.router.navigate(['/']);
      },
      loginError => {
        // Handle login error after registration
        this.errorMessage = 'Automatic login failed. Please log in manually.';
        this.isLoading = false;
      }
    );
  }
}
