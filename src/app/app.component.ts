import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Permisos } from './permisos/permisos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public estaSesionIniciada: boolean;

  constructor(private router: Router) {
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

  public esPermisoAdministracion(): boolean {
    return Permisos.esPermisoAdministracion();
  }
}
