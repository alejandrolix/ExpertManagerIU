import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Siniestro } from '../interfaces/siniestro';

@Injectable({
  providedIn: 'root'
})
export class SiniestrosService {

  constructor(private http: HttpClient) { }

  public ObtenerTodos(): Observable<Siniestro[]> {
    return this.http.get<Siniestro[]>('https://localhost:44345/api/Siniestros');
  }
}
