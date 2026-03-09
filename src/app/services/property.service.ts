import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/properties';

  createProperty(payload: unknown): Observable<unknown> {
    return this.http.post(this.apiUrl, payload);
  }
}