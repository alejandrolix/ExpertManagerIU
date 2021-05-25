import { Component, OnInit } from '@angular/core';
import { InicioService } from 'src/app/servicios/inicio.service';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  public estadisticas: any;
  public mostrarSpinner: boolean;
  public tieneUsuarioPermisoAdministracion: boolean;

  constructor(private inicioService: InicioService, private usuariosService: UsuariosService, private permisosService: PermisosService) {
    this.mostrarSpinner = false;
  }

  async ngOnInit(): Promise<void> {
    this.mostrarSpinner = true;
    let idUsuarioLogueado: number = this.usuariosService.obtenerIdUsuarioLogueado();
    this.tieneUsuarioPermisoAdministracion = this.permisosService.tienePermisoAdministracion();

    this.estadisticas = await this.inicioService.obtenerEstadisticasPorIdUsuario(idUsuarioLogueado).toPromise();    
    this.mostrarSpinner = false;
  }
}
