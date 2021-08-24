import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Estadistica } from '../interfaces/estadistica';

@Injectable({
  providedIn: 'root'
})
export class InicioService {

  constructor(private http: HttpClient) { }

  public hacerPeticionGet<T>(url: string): Observable<T> {
    return this.http.get<T>(`${environment.urlApi}/${url}`)
                    .pipe(
                      catchError(mensaje => {
                        debugger;
                        return throwError(mensaje);
                      })
                    );
  } 

  public obtenerEstadisticasPorIdUsuario(idUsuario: number): Observable<Estadistica> {
    let urlPeticion: string = `${environment.urlApi}/Inicio/${idUsuario}`;

    return this.hacerPeticionGet<Estadistica>(urlPeticion);
  }
}
