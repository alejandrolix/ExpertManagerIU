import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Estadistica } from '../interfaces/estadistica';
import { RespuestaApi } from '../interfaces/respuestaApi';

@Injectable({
  providedIn: 'root'
})
export class InicioService {

  constructor(private http: HttpClient) { }

  public hacerPeticionGet<T>(url: string): Observable<T> {
    return this.http.get<RespuestaApi>(url)
                    .pipe(
                      map((respuesta: RespuestaApi) => respuesta.datos),
                      catchError(error => {
                        if (error.codigoRespuesta === 500 && error.mensaje)
                          return throwError(error.mensaje);

                        return throwError('Ha habido un error al obtener los datos');
                      })
                    );
  } 

  public obtenerEstadisticasPorIdUsuario(idUsuario: number): Observable<Estadistica> {
    return this.hacerPeticionGet<Estadistica>(`${environment.urlApi}/Inicio/${idUsuario}`);
  }
}
