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
    this.estaSesionIniciada = false;
  }

  public mostrarPaginaPrincipal(e: boolean): void {
    this.estaSesionIniciada = e;
    this.router.navigateByUrl('/siniestros');
  }
}
