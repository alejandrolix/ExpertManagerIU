import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { Alerta } from '../clases/Alerta';
import { PermisosService } from '../servicios/permisos.service';

@Injectable({
  providedIn: 'root'
})
export class ComprobarPermisoGuard implements CanActivate, CanActivateChild {
  
  constructor(private permisosService: PermisosService) { }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.permisosService.tienePermisoAdministracion())
      return true;

    return Alerta.mostrarErrorAsincrono('No puede acceder a esta sección porque no tiene el permiso adecuado').then(() => {
      return false;
    });
  }
}
