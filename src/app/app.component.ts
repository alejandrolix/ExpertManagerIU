import { Component, OnInit } from '@angular/core';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { AutenticacionService } from './servicios/autenticacion.service';
import { SpinnerService } from './servicios/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private autenticacionService: AutenticacionService, private router: Router, private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.router.events.subscribe((evento: Event) => {
      // if (evento instanceof NavigationStart)
      //   this.spinnerService.mostrarSpinner();

      // if (evento instanceof NavigationEnd || evento instanceof NavigationCancel || evento instanceof NavigationError)
      //   setTimeout(() => this.spinnerService.ocultarSpinner(), 1000);
    });
  }

  public get estaLogueadoUsuario(): boolean {
    return this.autenticacionService.estaLogueadoUsuario;
  }
}
