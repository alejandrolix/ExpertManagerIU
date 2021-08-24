import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Estadistica } from '../interfaces/estadistica';

@Injectable({
  providedIn: 'root'
})
export class InicioService {

  constructor(private http: HttpClient) { }

  public obtenerEstadisticasPorIdUsuario(idUsuario: number): Observable<Estadistica> {
    return this.http.get<Estadistica>(`${environment.urlApi}/Inicio/${idUsuario}`);
  }
}
