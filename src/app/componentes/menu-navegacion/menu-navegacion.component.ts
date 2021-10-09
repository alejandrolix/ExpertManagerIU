import { Component, OnInit } from '@angular/core';
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

  constructor(private permisosService: PermisosService, private autenticacionService: AutenticacionService) {
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
    this.autenticacionService.cerrarSesion();
  }
}
