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


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    this.successMessage = '';
    this.authService.login(this.username, this.password).subscribe(
      data => {
        this.successMessage = 'Login successful!';
        this.router.navigate(['/']); // Redirect to home page
      },
      error => {
        this.error = 'Login failed';
      }
    );
  }
}
