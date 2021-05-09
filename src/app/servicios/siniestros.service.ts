import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SiniestrosService {

  constructor(private http: HttpClient) { }

  public ObtenerTodos() {
    return this.http.get('https://localhost:44345/api/Siniestros');
  }
}
