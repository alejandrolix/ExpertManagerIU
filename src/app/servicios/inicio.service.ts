import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PeticionHttp } from '../clases/PeticionHttp';
import { Estadistica } from '../interfaces/estadistica/estadistica';

@Injectable({
  providedIn: 'root'
})
export class InicioService {

  constructor(private peticionHttp: PeticionHttp) { }

  public obtenerEstadisticasPorIdUsuario(idUsuario: number): Observable<Estadistica> {
    return this.peticionHttp.get<Estadistica>(`${environment.urlApi}/Inicio/${idUsuario}`);
  }
}
