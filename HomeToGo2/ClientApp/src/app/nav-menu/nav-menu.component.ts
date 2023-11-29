import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../Authentication/auth.service';
import { Subscription } from 'rxjs';
import {User} from "oidc-client";

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnDestroy {
  isExpanded = false;
  isAuthenticated = false;
  username: string = '';
  private authSubscription: Subscription;

  constructor(private authService: AuthService) {
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      this.isAuthenticated = !!user;
      this.username = user ? user.username : '';
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logout() {
    if (confirm('Are you sure you want to log out?')) {
      this.authService.logout();
      // Redirect to home page or perform additional actions
    }
  }

  protected readonly User = User;
}
