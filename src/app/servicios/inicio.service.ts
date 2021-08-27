import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PeticionHttp } from '../clases/PeticionHttp';
import { Estadistica } from '../interfaces/estadistica';

@Injectable({
  providedIn: 'root'
})
export class InicioService {

  constructor(private http: HttpClient) { }

  public obtenerEstadisticasPorIdUsuario(idUsuario: number): Observable<Estadistica> {
    let peticionHttp: PeticionHttp = new PeticionHttp(this.http);
    
    return peticionHttp.hacerPeticionGet<Estadistica>(`${environment.urlApi}/Inicio/${idUsuario}`);
  }
}
