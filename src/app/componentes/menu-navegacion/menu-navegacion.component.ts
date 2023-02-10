import { Component, OnInit } from '@angular/core';
import { Alerta } from 'src/app/clases/Alerta';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { PermisosService } from '../../servicios/permisos.service';

@Component({
  selector: 'app-menu-navegacion',
  templateUrl: './menu-navegacion.component.html',
  styleUrls: ['./menu-navegacion.component.scss']
})
export class MenuNavegacionComponent implements OnInit {
  public usuario: string;
  public mostrarUsuario: boolean;
  public tienePermisoAdministracion: boolean;

  constructor(private permisosService: PermisosService, private autenticacionService: AutenticacionService) {
    this.mostrarUsuario = false;
  }

  ngOnInit(): void {
    let nombreUsuario: string = this.autenticacionService.obtenerNombreUsuario();

    if (nombreUsuario.length === 0) {
      this.mostrarUsuario = false;
      Alerta.mostrarError('El nombre de usuario no existe');
    }
    else {
      this.mostrarUsuario = true;
      this.usuario = nombreUsuario;
    }

    this.tienePermisoAdministracion = this.permisosService.tienePermisoAdministracion();
  }

  public cerrarSesion(): void {
    this.autenticacionService.cerrarSesion();
  }
}
