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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  register() {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    if (this.password !== this.confirmPassword) {
      this.isLoading = false;
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService.register(this.email, this.username, this.password).subscribe(
      response => {
        this.successMessage = 'Registration successful!';
        // Automatically log in after successful registration
        this.loginAfterRegister();
      },
      error => {
        this.isLoading = false;
        this.errorMessage = error.error.message || 'Registration failed';
      }
    );
  }

  private loginAfterRegister() {
    this.authService.login(this.username, this.password).subscribe(
      success => {
        this.router.navigate(['/']); // Navigate to home or dashboard
      },
      loginError => {
        this.errorMessage = 'Automatic login failed. Please log in manually.';
        this.isLoading = false;
      }
    );
  }
}
