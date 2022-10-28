import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from './servicios/autenticacion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private autenticacionService: AutenticacionService) { }

  ngOnInit(): void {

  }

  public get estaLogueadoUsuario(): boolean {
    return this.autenticacionService.estaLogueadoUsuario;
  }
}
