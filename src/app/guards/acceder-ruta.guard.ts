import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Alerta } from '../clases/Alerta';
import { PermisosService } from '../servicios/permisos.service';

@Injectable({
  providedIn: 'root'
})
export class AccederRutaGuard implements CanActivate {
  
  constructor(private permisosService: PermisosService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
    if (this.permisosService.tienePermisoAdministracion())
      return true;

    return new Observable(() => {
      Alerta.mostrarErrorAsincrono('No puede acceder a esta sección porque no tiene el permiso adecuado')
            .then(() => {
              history.back();
              return false;
            });
    });
  }
}
