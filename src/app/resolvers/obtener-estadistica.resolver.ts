import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Estadistica } from '../interfaces/estadistica';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { InicioService } from '../servicios/inicio.service';

@Injectable({
  providedIn: 'root'
})
export class ObtenerEstadisticaResolver implements Resolve<{ estadistica: null | Estadistica, error: null | string }> {
  constructor(private autenticacionService: AutenticacionService, private inicioService: InicioService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ estadistica: null | Estadistica, error: null | string }> {        
    let idUsuario: number = this.autenticacionService.obtenerIdUsuario();    

    return this.inicioService.obtenerEstadisticasPorIdUsuario(idUsuario)
                             .pipe(
                                map((estadistica: Estadistica) => {
                                  return {
                                    estadistica,
                                    error: null
                                  };
                                }),
                                catchError((mensaje: string) => {                                  
                                  return of({
                                    estadistica: null,
                                    error: mensaje
                                  });
                                })
                             );
  }
}
