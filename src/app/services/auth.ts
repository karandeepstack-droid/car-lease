import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  _id?: string;
  name?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = 'http://localhost:8000/api/auth';
  private _tokenKey = 'auth_token';
  private _userKey = 'auth_user';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // -----------------------------
  // TOKEN
  // -----------------------------
  getToken(): string | null {
    return localStorage.getItem(this._tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this._tokenKey, token);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this._tokenKey);
    localStorage.removeItem(this._userKey);
    this.router.navigate(['/login']);
  }

  getUser(): User | null {
    const raw = localStorage.getItem(this._userKey);
    return raw ? JSON.parse(raw) : null;
  }

  private saveUser(user: User): void {
    localStorage.setItem(this._userKey, JSON.stringify(user));
  }

  // -----------------------------
  // AUTH API
  // -----------------------------
  register(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post<{ token: string; user: User }>(`${this.API}/register`, data).pipe(
      tap(res => this.handleAuthSuccess(res.token, res.user))
    );
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post<{ token: string; user: User }>(`${this.API}/login`, data).pipe(
      tap(res => this.handleAuthSuccess(res.token, res.user))
    );
  }

  handleAuthSuccess(token: string, user: User): void {
    this.setToken(token);
    this.saveUser(user);
  }
}
