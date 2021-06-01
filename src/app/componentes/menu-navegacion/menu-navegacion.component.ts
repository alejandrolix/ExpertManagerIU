import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { PermisosService } from '../../servicios/permisos.service';

@Component({
  selector: 'app-menu-navegacion',
  templateUrl: './menu-navegacion.component.html',
  styleUrls: ['./menu-navegacion.component.scss']
})
export class MenuNavegacionComponent implements OnInit {
  public usuario: string;
  public mostrarUsuario: boolean;

  constructor(private permisosService: PermisosService, private usuariosService: UsuariosService) {
    this.mostrarUsuario = false;
  }

  ngOnInit(): void {
    if (localStorage.getItem('usuario') == null)
      this.mostrarUsuario = false;
    else {
      this.mostrarUsuario = true;
      this.usuario = localStorage.getItem('usuario') ?? '';
    }    
  }

  public tienePermisoAdministracion(): boolean {
    return this.permisosService.tienePermisoAdministracion();
  }

  public cerrarSesion(): void {        
    this.usuariosService.cerrarSesionSubject.next(true);
  }
}
