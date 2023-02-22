import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CerrarSiniestroDto } from '../interfaces/DTOs/siniestro/cerrar-siniestro-dto';
import { CrearSiniestroDto } from '../interfaces/DTOs/siniestro/crear-siniestro-dto';
import { EditarSiniestroDto } from '../interfaces/DTOs/siniestro/editar-siniestro-dto';
import { PeticionHttp } from '../clases/PeticionHttp';
import { ImpValoracionDaniosSiniestroDto } from '../interfaces/DTOs/siniestro/imp-valoracion-danios-siniestro-dto';
import { Siniestro } from '../interfaces/siniestro';
import { AbrirSiniestroDto } from '../interfaces/DTOs/siniestro/abrir-siniestro-dto';

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

  public abrir(abrirSiniestroDto: AbrirSiniestroDto): Observable<boolean> {
    return this.peticionHttp.hacerPeticionPut<boolean>(`${environment.urlApi}/Siniestros/Abrir`, abrirSiniestroDto);
  }

  public editar(siniestro: EditarSiniestroDto, id: number): Observable<boolean> {
    return this.peticionHttp.hacerPeticionPut<boolean>(`${environment.urlApi}/Siniestros/${id}`, siniestro);
  }

  public eliminar(id: number): Observable<boolean> {
    return this.peticionHttp.hacerPeticionDelete<boolean>(`${environment.urlApi}/Siniestros/${id}`);
  }

  public cerrar(cerrarSiniestroDto: CerrarSiniestroDto): Observable<boolean> {
    return this.peticionHttp.hacerPeticionPut<boolean>(`${environment.urlApi}/Siniestros/Cerrar`, cerrarSiniestroDto);
  }

  public esImpValoracionDaniosSiniestroMayorQuePerito(impValoracionDaniosSiniestroDto: ImpValoracionDaniosSiniestroDto): Observable<boolean> {
    let parametros: HttpParams = new HttpParams();
    parametros = parametros.set('idPerito', impValoracionDaniosSiniestroDto.idPerito.toString());
    parametros = parametros.set('idSiniestro', impValoracionDaniosSiniestroDto.idSiniestro.toString());

    return this.peticionHttp.hacerPeticionGetConOpcionesJson<boolean>(`${environment.urlApi}/Siniestros/EsImpValoracionDaniosSiniestroMayorQuePerito`, {
      params: parametros
    });
  }
}
