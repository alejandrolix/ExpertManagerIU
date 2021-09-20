import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PeticionHttp } from '../clases/PeticionHttp';
import { TipoPermiso } from '../enumeraciones/tipo-permiso.enum';
import { Permiso } from '../interfaces/permiso';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  constructor(private peticionHttp: PeticionHttp) { }

  public obtenerTodos(): Observable<Permiso[]> {
    return this.peticionHttp.hacerPeticionGet<Permiso[]>(`${environment.urlApi}/Permisos`);
  }

  public obtenerIdPermisoLogueado(): number {
    let idPermiso: string | null = localStorage.getItem('idPermiso');

    if (idPermiso == null)
      return 0;

    let idPermisoNumero: number = parseInt(idPermiso);

    return idPermisoNumero;
  }

  public tienePermisoPeritoNoResponsable(): boolean {
    let idPermiso: number = this.obtenerIdPermisoLogueado();

    if (idPermiso !== 0 && idPermiso === TipoPermiso.PeritoNoResponsable)      
      return true;

    return false;
  }

  public tienePermisoPeritoResponsable(): boolean {
    let idPermiso: number = this.obtenerIdPermisoLogueado();

    if (idPermiso != 0)
      if (idPermiso == 2)
        return true;
      else
        return false;

    return false;
  }

  public tienePermisoAdministracion(): boolean {
    let idPermiso: string | null = localStorage.getItem('idPermiso');

    if (idPermiso == null)
      return false;

    let idPermisoNumero: number = parseInt(idPermiso);

    if (idPermisoNumero == 1)
      return true;
    else
      return false;
  }
}
