import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CrearSiniestroDto } from '../clases/DTOs/crear-siniestro-dto';
import { EditarSiniestroDto } from '../clases/DTOs/editar-siniestro-dto';
import { PeticionHttp } from '../clases/PeticionHttp';
import { Siniestro } from '../interfaces/siniestro';

@Injectable({
  providedIn: 'root'
})
export class SiniestrosService {

  constructor(private peticionHttp: PeticionHttp) { }

  public obtenerTodos(idPerito: number, idAseguradora: number): Observable<Siniestro[]> {    
    return this.peticionHttp.hacerPeticionGet<Siniestro[]>(`${environment.urlApi}/Siniestros?idPerito=${idPerito}&idAseguradora=${idAseguradora}`);
  }

  public obtenerPorPeritoNoResponsable(idPerito: number, idAseguradora: number): Observable<Siniestro[]> { 
    return this.peticionHttp.hacerPeticionGet<Siniestro[]>(`${environment.urlApi}/Siniestros/PeritoNoResponsable?idPerito=${idPerito}&idAseguradora=${idAseguradora}`);
  }

  public obtenerPorPeritoResponsable(idPerito: number, idAseguradora: number): Observable<Siniestro[]> {   
    return this.peticionHttp.hacerPeticionGet<Siniestro[]>(`${environment.urlApi}/Siniestros/PeritoResponsable?idPerito=${idPerito}&idAseguradora=${idAseguradora}`);
  }

  public obtenerPorId(id: number): Observable<Siniestro> {    
    return this.peticionHttp.hacerPeticionGet<Siniestro>(`${environment.urlApi}/Siniestros/${id}`);
  }

  public crear(siniestro: CrearSiniestroDto): Observable<boolean> {    
    return this.peticionHttp.hacerPeticionPost<boolean>(`${environment.urlApi}/Siniestros`, siniestro);
  }

  public editar(siniestro: EditarSiniestroDto, id: number): Observable<boolean> {    
    return this.peticionHttp.hacerPeticionPut<boolean>(`${environment.urlApi}/Siniestros/${id}`, siniestro);
  }

  public eliminar(id: number): Observable<boolean> {    
    return this.peticionHttp.hacerPeticionDelete<boolean>(`${environment.urlApi}/Siniestros/${id}`);
  }

  public cerrar(id: number): Observable<boolean> {    
    return this.peticionHttp.hacerPeticionPut<boolean>(`${environment.urlApi}/Siniestros/Cerrar/${id}`, null);
  }
}
