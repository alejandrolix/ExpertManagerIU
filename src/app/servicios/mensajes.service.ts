import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Mensaje } from '../interfaces/mensaje';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor(private http: HttpClient) { }

  public crear(mensaje: any): Observable<boolean> {
    return this.http.post<boolean>(`${environment.urlApi}/Mensajes`, mensaje);
  }

  public obtenerTodosPorIdSiniestro(idSiniestro: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${environment.urlApi}/Mensajes`);
  }
}
