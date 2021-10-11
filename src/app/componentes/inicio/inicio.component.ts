import { Component, OnInit } from '@angular/core';
import { Alerta } from 'src/app/clases/Alerta';
import { Estadistica } from 'src/app/interfaces/estadistica';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { InicioService } from 'src/app/servicios/inicio.service';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  public estadisticas: Estadistica;
  public tieneUsuarioPermisoAdministracion: boolean;

  constructor(private inicioService: InicioService, private permisosService: PermisosService, private spinnerService: SpinnerService,
              private autenticacionService: AutenticacionService) { }

  async ngOnInit(): Promise<void> {    
    let idUsuario: number = this.autenticacionService.obtenerIdUsuario();

    this.spinnerService.mostrarSpinner();    
    this.tieneUsuarioPermisoAdministracion = this.permisosService.tienePermisoAdministracion();

    try {
      this.estadisticas = await this.inicioService.obtenerEstadisticasPorIdUsuario(idUsuario)
                                                  .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
    }
    
    this.spinnerService.ocultarSpinner();
  }
}
