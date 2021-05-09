import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Siniestro } from '../interfaces/siniestro';

@Injectable({
  providedIn: 'root'
})
export class SiniestrosService {

  constructor(private http: HttpClient) { }

  public obtenerTodos(): Observable<Siniestro[]> {    
    return this.http.get<Siniestro[]>(`${environment.urlApi}/Siniestros`);
  }
}
