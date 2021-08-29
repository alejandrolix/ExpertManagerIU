import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PeticionHttp } from '../clases/PeticionHttp';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class PeritosService {

  constructor(private peticionHttp: PeticionHttp) { }

  public obtenerTodos(): Observable<Usuario[]> {    
    return this.peticionHttp.hacerPeticionGet<Usuario[]>(`${environment.urlApi}/Peritos`);
  }

  public obtenerImpReparacionDaniosPorIdPerito(idPerito: number): Observable<number> {
    return this.peticionHttp.hacerPeticionGet<number>(`${environment.urlApi}/Peritos/ImporteReparacionDanios/${idPerito}`);
  } 
}
