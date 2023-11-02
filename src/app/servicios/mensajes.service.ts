import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PeticionHttp } from '../clases/PeticionHttp';
import { CrearMensajeRevisarCierreDto } from '../interfaces/DTOs/crear-mensaje-revisar-cierre-dto';
import { Mensaje } from '../interfaces/mensaje';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor(private peticionHttp: PeticionHttp) { }

  public crear(mensaje: any): Observable<boolean> {
    return this.peticionHttp.hacerPeticionPost<boolean>(`${environment.urlApi}/Mensajes`, mensaje);
  }

  public crearMensajeRevisarCierre(crearMensajeRevisarCierreDto: CrearMensajeRevisarCierreDto): Observable<boolean> {
    return this.peticionHttp.hacerPeticionPost<boolean>(`${environment.urlApi}/Mensajes/RevisarCierre`, crearMensajeRevisarCierreDto);
  }

  public eliminar(idMensaje: number): Observable<boolean> {
    return this.peticionHttp.hacerPeticionDelete<boolean>(`${environment.urlApi}/Mensajes/${idMensaje}`);
  }

  public obtenerTodosPorIdSiniestro(idSiniestro: number): Observable<Mensaje[]> {
    return this.peticionHttp.get<Mensaje[]>(`${environment.urlApi}/Mensajes/${idSiniestro}`);
  }
}
