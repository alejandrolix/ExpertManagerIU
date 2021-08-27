import { Component, OnInit } from '@angular/core';
import { Alertas } from 'src/app/clases/Alertas';
import { Estadistica } from 'src/app/interfaces/estadistica';
import { InicioService } from 'src/app/servicios/inicio.service';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  public estadisticas: Estadistica;
  public mostrarSpinner: boolean;
  public tieneUsuarioPermisoAdministracion: boolean;

  constructor(private inicioService: InicioService, private usuariosService: UsuariosService, private permisosService: PermisosService) {
    this.mostrarSpinner = false;
  }

  ngOnInit(): void {
    this.mostrarSpinner = true;
    let idUsuarioLogueado: number = this.usuariosService.obtenerIdUsuarioLogueado();
    this.tieneUsuarioPermisoAdministracion = this.permisosService.tienePermisoAdministracion();

    this.inicioService.obtenerEstadisticasPorIdUsuario(idUsuarioLogueado)
                      .subscribe((estadisticas: Estadistica) => this.estadisticas = estadisticas,
                      (mensaje: string) => Alertas.mostrarError(mensaje));

    this.mostrarSpinner = false;
  }
}
