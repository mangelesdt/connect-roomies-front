import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChangePasswordRequest, LoginRequest, LoginResponse, RegisterRequest, UserRole } from '../interfaces/auth.interface';
import { isPlatformBrowser } from '@angular/common';
import { UserProfile } from '../interfaces/user.interface';
import { Vivienda } from '../interfaces/vivienda.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private platformId = inject(PLATFORM_ID);

  constructor(
    private http: HttpClient,
  ) {}

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

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
    if(this.isBrowser) {
      localStorage.removeItem('user');
      localStorage.removeItem('basicAuth');
    }
  }

  getUser(): LoginResponse | null {
    if(!this.isBrowser) {
      return null;
    }

    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLogged(): boolean {
    return !!this.getUser();
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

  register(data: RegisterRequest) {
    return this.http.post(`${environment.apiUrl}/api/usuarios`, data, { responseType: 'text' });
  }

  restoreSession(): void {
    if (typeof window === 'undefined') return;

    const user = localStorage.getItem('user');
    const basicAuth = localStorage.getItem('basicAuth');

    if (user && basicAuth) {
      return;
    }

    localStorage.removeItem('user');
    localStorage.removeItem('basicAuth');
  }

  getProfile(id: number): Observable<UserProfile> {
      return this.http.get<UserProfile>(`${this.apiUrl}/api/usuarios/${id}`);
  }

  updateProfile(id: number, data: Partial<UserProfile>) {
    return this.http.put<UserProfile>(`${this.apiUrl}/api/usuarios/${id}`, data).pipe(
      tap(() => {
        const currentUser = this.getUser();

        if (currentUser) {
          const updatedUser = { ...currentUser, ...data };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      })
    );
  }

  getAllUsers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.apiUrl}/api/usuarios`);
  }

  changePassword(data: ChangePasswordRequest) {
    return this.http.put(`${this.apiUrl}/api/usuarios/restablecer-password`, data, {
      responseType: 'text'
    });
  }
}