import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InicioService {

  constructor(private http: HttpClient) { }

  public obtenerEstadisticasPorIdUsuario(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${environment.urlApi}/Inicio/${idUsuario}`);
  }
}
