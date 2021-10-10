import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Alerta } from '../clases/Alerta';
import { AutenticacionService } from '../servicios/autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class InicioSesionGuard implements CanActivate {
  constructor(private autenticacionService: AutenticacionService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let tokenUsuario: string = this.autenticacionService.obtenerToken();

    if (tokenUsuario.length === 0)
      return new Observable(() => {
        Alerta.mostrarErrorAsincrono('No ha iniciado sesión. Por favor, inicie sesión').then(() => {
          this.autenticacionService.cerrarSesion();
          return false;
        });
      }); 
    
    return true;
  }
}
