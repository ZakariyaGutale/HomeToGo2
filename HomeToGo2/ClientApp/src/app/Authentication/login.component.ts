import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Authentication/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  error: string = '';
  successMessage = '';

  // Inject AuthService and Router for handling authentication and navigation
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    // Reset success message on each login attempt
    this.successMessage = '';
    // Call AuthService's login method with username and password
    this.authService.login(this.username, this.password).subscribe(
      data => {
        // On successful login, display a success message and navigate to the home page
        this.successMessage = 'Login successful!';
        this.router.navigate(['/']); // Redirect to home page
      },
      error => {
        // On login failure, set an error message to be displayed to the user
        this.error = 'Login failed';
      }
    );
  }
}
