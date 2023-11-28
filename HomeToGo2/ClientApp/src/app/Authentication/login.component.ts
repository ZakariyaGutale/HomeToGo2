import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Authentication/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  login() {
    this.authService.login(this.username, this.password)
      .subscribe(
        data => {
          // Navigate to dashboard or home page
        },
        error => {
          this.error = 'Login failed';
        });
  }
}
