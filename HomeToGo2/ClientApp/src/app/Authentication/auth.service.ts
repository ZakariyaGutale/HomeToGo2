import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from './user'; // User data model

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private apiUrl = '/api/account'; // Base API URL for user-related operations

  constructor(private http: HttpClient) {
    // Initialize currentUserSubject with the current user data from local storage
    const currentUserData = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(currentUserData ? JSON.parse(currentUserData) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    // Getter to access the current user value
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    // Authenticate user and store user data in local storage
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  register(email: string, username: string, password: string): Observable<any> {
    // Register a new user and return the response from the server
    return this.http.post<any>(`${this.apiUrl}/register`, { email, username, password })
      .pipe(map(response => {
        return response; // Directly return the response object
      }));
  }

  logout() {
    // Log out the current user by removing their data from local storage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getUsers(): Observable<IUser[]> {
    // Fetch a list of users from the server
    return this.http.get<IUser[]>(this.apiUrl);
  }
}
