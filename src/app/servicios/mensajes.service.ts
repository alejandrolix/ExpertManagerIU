import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PeticionHttp } from '../clases/PeticionHttp';
import { Mensaje } from '../interfaces/mensaje';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor(private http: HttpClient, private peticionHttp: PeticionHttp) { }

  public crear(mensaje: any): Observable<boolean> {
    return this.http.post<boolean>(`${environment.urlApi}/Mensajes`, mensaje);
  }

  public crearMensajeRevisarCierre(mensaje: any): Observable<boolean> {
    return this.peticionHttp.hacerPeticionPost<boolean>(`${environment.urlApi}/Mensajes/RevisarCierre`, mensaje);
  }

  public eliminar(idMensaje: number): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.urlApi}/Mensajes/${idMensaje}`);
  }

  public obtenerTodosPorIdSiniestro(idSiniestro: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${environment.urlApi}/Mensajes/${idSiniestro}`);
  }
}
