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
    this.usuariosService.cerrarSesionSubject.next(true);
  }
}
