import { Component, OnInit } from '@angular/core';
import { Estadistica } from 'src/app/interfaces/estadistica';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { InicioService } from 'src/app/servicios/inicio.service';
import { PermisosService } from 'src/app/servicios/permisos.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  public estadistica: Estadistica;
  public tieneUsuarioPermisoAdministracion: boolean;

  constructor(private autenticacionService: AutenticacionService, private permisosService: PermisosService, private inicioService: InicioService) { }

  async ngOnInit(): Promise<void> {
    let idUsuario: number = this.autenticacionService.obtenerIdUsuario();

    this.tieneUsuarioPermisoAdministracion = this.permisosService.tienePermisoAdministracion();
    this.estadistica = await this.inicioService.obtenerEstadisticasPorIdUsuario(idUsuario)
                                                .toPromise();
  }
}
