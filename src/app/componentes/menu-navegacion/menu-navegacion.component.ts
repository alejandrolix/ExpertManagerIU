import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { PermisosService } from '../../servicios/permisos.service';

@Component({
  selector: 'app-menu-navegacion',
  templateUrl: './menu-navegacion.component.html',
  styleUrls: ['./menu-navegacion.component.scss']
})
export class MenuNavegacionComponent implements OnInit {

  constructor(private permisosService: PermisosService, private usuariosService: UsuariosService) { }

  ngOnInit(): void {
  }

  public tienePermisoAdministracion(): boolean {
    return this.permisosService.tienePermisoAdministracion();
  }

  public cerrarSesion(): void {
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('usuario');
    localStorage.removeItem('idPermiso');
    
    this.usuariosService.cerrarSesionSubject.next(true);
  }
}
