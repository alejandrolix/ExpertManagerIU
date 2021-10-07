import { Component } from '@angular/core';
import { AutenticacionService } from './servicios/autenticacion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {  
  constructor(private autenticacionService: AutenticacionService) { }     

  public get estaLogueadoUsuario(): boolean {
    return this.autenticacionService.estaLogueadoUsuario;
  }
}
