import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AlquilerOwnerItem,
  AlquilerResponse,
  AlquilerUsuarioItem,
  RegistrarAlquilerRequest
} from '../interfaces/alquiler.interface';

@Injectable({
  providedIn: 'root'
})
export class AlquilerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  crearSolicitud(data: RegistrarAlquilerRequest): Observable<AlquilerResponse> {
    return this.http.post<AlquilerResponse>(`${this.apiUrl}/api/alquileres`, data);
  }

  getSolicitudesPropietario(propietarioId: number): Observable<AlquilerOwnerItem[]> {
    const params = new HttpParams().set('propietarioId', propietarioId);
    return this.http.get<AlquilerOwnerItem[]>(`${this.apiUrl}/api/alquileres/propietario`, { params });
  }

  getSolicitudesUsuario(usuarioId: number): Observable<AlquilerUsuarioItem[]> {
    return this.http.get<AlquilerUsuarioItem[]>(`${this.apiUrl}/api/alquileres/usuario/${usuarioId}`);
  }

  getTodasSolicitudes(): Observable<AlquilerOwnerItem[]> {
    return this.http.get<AlquilerOwnerItem[]>(`${this.apiUrl}/api/alquileres`);
  }

  actualizarEstadoSolicitud(alquilerId: number, estado: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/api/alquileres/${alquilerId}/estado`, { estado });
  }

  cancelarSolicitud(alquilerId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/api/alquileres/${alquilerId}/cancelar`, {});
  }
}