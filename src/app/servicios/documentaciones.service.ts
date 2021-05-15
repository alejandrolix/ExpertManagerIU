import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Documentacion } from '../interfaces/documentacion';

@Injectable({
  providedIn: 'root'
})
export class DocumentacionesService {

  constructor(private http: HttpClient) { }

  public obtenerPorIdSiniestro(id: number): Observable<Documentacion[]> {
    return this.http.get<Documentacion[]>(`${environment.urlApi}/Documentaciones/ObtenerPorIdSiniestro/${id}`);
  }
}
