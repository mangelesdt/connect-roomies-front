import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, UserRole } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    const basicAuth = btoa(`${data.email}:${data.password}`);

    return this.http.post<LoginResponse>(`${this.apiUrl}/api/auth/login`, data).pipe(
      tap((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('basicAuth', basicAuth);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('basicAuth');
  }

  getUser(): LoginResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLogged(): boolean {
    return !!localStorage.getItem('user');
  }

  getRole(): UserRole | null {
    return this.getUser()?.rol ?? null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isArrendador(): boolean {
    return this.getRole() === 'PROPIETARIO';
  }

  isArrendatario(): boolean {
    return this.getRole() === 'USUARIO';
  }

  canPublish(): boolean {
    const role = this.getRole();
    return role === 'ADMIN' || role === 'PROPIETARIO';
  }
}