import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { PermisosService } from '../servicios/permisos.service';

@Injectable({
  providedIn: 'root'
})
export class AccederRutaGuard implements CanActivate {
  
  constructor(private permisosService: PermisosService) { }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
    if (this.permisosService.tienePermisoAdministracion())
      return true;

    return new Observable(observer => {
      Swal.fire({
        title: 'No puede acceder a esta sección porque no tiene el permiso adecuado',
        icon: 'error',          
        confirmButtonColor: '#3085d6',          
        confirmButtonText: 'Aceptar',          
      })
      .then((accion: SweetAlertResult) => {
        if (accion.isConfirmed) {
          observer.next(false);
          observer.complete();

          return false;
        }          

        return true;
      });
    });
  }
}
