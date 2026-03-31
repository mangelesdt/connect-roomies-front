import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Vivienda } from '../interfaces/vivienda.interface';
import { ViviendaCreateRequest } from '../interfaces/vivienda-create.interface';

@Injectable({
  providedIn: 'root'
})
export class ViviendaService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,   
  ) {}
  
  getViviendas(): Observable<Vivienda[]> {
    return this.http.get<Vivienda[]>(`${this.apiUrl}/api/viviendas`);
  }

  getViviendaById(id: number): Observable<Vivienda> {
    return this.http.get<Vivienda>(`${this.apiUrl}/api/viviendas/${id}`);
  }

  createVivienda(viviendaData: ViviendaCreateRequest): Observable<Vivienda> {
    return this.http.post<Vivienda>(`${this.apiUrl}/api/viviendas`, viviendaData);
  }

  getMisViviendas(id: number): Observable<Vivienda[]> {
    return this.http.get<Vivienda[]>(`${this.apiUrl}/api/viviendas/viviendas-propietario/${id}`);
  }

  deleteVivienda(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/viviendas/${id}`, { responseType: 'text' as 'json' });
  }

  updateVivienda(id: number, viviendaData: ViviendaCreateRequest): Observable<Vivienda> {
    return this.http.put<Vivienda>(`${this.apiUrl}/api/viviendas/${id}`, viviendaData);
  }
}