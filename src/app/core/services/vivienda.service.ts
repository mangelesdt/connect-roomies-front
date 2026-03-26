import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Vivienda } from '../interfaces/vivienda.interface';

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

}