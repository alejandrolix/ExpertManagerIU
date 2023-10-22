import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Alerta } from '../clases/Alerta';
import { AutenticacionService } from '../servicios/autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class InicioSesionGuard  {
  constructor(private autenticacionService: AutenticacionService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let tokenUsuario: string = this.autenticacionService.obtenerToken();

    if (tokenUsuario.length === 0)
      return Alerta.mostrarErrorAsincrono('No ha iniciado sesión. Por favor, inicie sesión').then(() => {
        this.autenticacionService.cerrarSesion();
        return false;
      });

    return true;
  }
}
