import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PermisosService } from './servicios/permisos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public estaSesionIniciada: boolean;

  constructor(private router: Router, private permisosService: PermisosService) {
    if (localStorage.getItem('usuario') == null) {      
      this.estaSesionIniciada = false;
      this.router.navigateByUrl('/inicioSesion');
    }
    else
      this.estaSesionIniciada = true;
  }

  public mostrarPaginaPrincipal(e: boolean): void {
    this.estaSesionIniciada = e;
    this.router.navigateByUrl('/siniestros');
  }

  public tienePermisoAdministracion(): boolean {
    return this.permisosService.tienePermisoAdministracion();
  }
}
