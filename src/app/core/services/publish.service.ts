import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PublishService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  createPublication(data: any) {
    return this.http.post(`${this.apiUrl}/api/viviendas`, data);
  }
}