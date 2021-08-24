import { Component, OnInit } from '@angular/core';
import { Estadistica } from 'src/app/interfaces/estadistica';
import { InicioService } from 'src/app/servicios/inicio.service';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import Swal from 'sweetalert2';

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
                      () => this.mostrarAlertaError('Ha habido un error al obtener las estadísticas del usuario. Inténtelo de nuevo'));

    this.mostrarSpinner = false;
  }

  private mostrarAlertaError(mensaje: string): void {
    Swal.fire({
      title: mensaje,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }
}
