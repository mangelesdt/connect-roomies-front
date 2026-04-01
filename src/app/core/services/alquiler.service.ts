import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AlquilerOwnerItem, AlquilerResponse, RegistrarAlquilerRequest } from '../interfaces/alquiler.interface';

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

  actualizarEstadoSolicitud(alquilerId: number, estado: 'ACEPTADO' | 'RECHAZADO'): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/alquileres/${alquilerId}/estado`, { estado });
  }

  getTodasSolicitudes() {
    return this.http.get<AlquilerOwnerItem[]>(`${this.apiUrl}/api/alquileres`);
}
}