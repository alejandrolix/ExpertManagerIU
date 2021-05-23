import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermisosService } from '../../servicios/permisos.service';

@Component({
  selector: 'app-menu-navegacion',
  templateUrl: './menu-navegacion.component.html',
  styleUrls: ['./menu-navegacion.component.scss']
})
export class MenuNavegacionComponent implements OnInit {

  constructor(private permisosService: PermisosService, private router: Router) { }

  ngOnInit(): void {
  }

  public tienePermisoAdministracion(): boolean {
    return this.permisosService.tienePermisoAdministracion();
  }

  public cerrarSesion(): void {
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('usuario');
    localStorage.removeItem('idPermiso');

    this.router.navigateByUrl('/inicioSesion');
  }
}
