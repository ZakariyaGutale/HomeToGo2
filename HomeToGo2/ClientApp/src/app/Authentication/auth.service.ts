import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    const currentUserData = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(currentUserData ? JSON.parse(currentUserData) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }


  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`/api/account/login`, { username, password })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }


  register(email: string, username: string, password: string): Observable<any> {
    return this.http.post<any>(`/api/account/register`, { email, username, password })
      .pipe(map(response => {
        return response; // Directly return the response object
      }));
  }

  logout() {
    // Remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // Additional methods for registration, etc.
}
