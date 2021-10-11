import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { Estadistica } from '../interfaces/estadistica';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { InicioService } from '../servicios/inicio.service';

@Injectable({
  providedIn: 'root'
})
export class ObtenerEstadisticaResolver implements Resolve<Estadistica> {
  constructor(private autenticacionService: AutenticacionService, private inicioService: InicioService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Estadistica> {
    let idUsuario: number = this.autenticacionService.obtenerIdUsuario();
    return this.inicioService.obtenerEstadisticasPorIdUsuario(idUsuario);
  }
}
