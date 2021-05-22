import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  get esPermisoAdministracion(): boolean {
    let idPermiso: string | null = localStorage.getItem('idPermiso');

    if (idPermiso !== null) {
      let idPermisoNumero: number = parseInt(idPermiso);

      if (idPermisoNumero == 1)
        return true;
      else
        return false;
    }
    
    return false;     
  }
}
