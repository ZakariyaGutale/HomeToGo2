import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    // Check if there is a current user logged in
    if (currentUser) {
      // If a user is logged in, allow access to the route
      return true;
    }

    // If no user is logged in, redirect to the login page and pass the return URL
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false; // Deny access to the route
  }
}
