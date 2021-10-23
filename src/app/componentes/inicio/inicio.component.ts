import { Component, OnInit } from '@angular/core';
import { Alerta } from 'src/app/clases/Alerta';
import { Estadistica } from 'src/app/interfaces/estadistica';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { InicioService } from 'src/app/servicios/inicio.service';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { SignalRService } from 'src/app/servicios/signal-r.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  public estadistica: Estadistica;
  public tieneUsuarioPermisoAdministracion: boolean;

  constructor(private autenticacionService: AutenticacionService, private permisosService: PermisosService, private spinnerService: SpinnerService, private inicioService: InicioService,
              private signalRService: SignalRService) { }

  async ngOnInit(): Promise<void> {
    let idUsuario: number = this.autenticacionService.obtenerIdUsuario();

    this.spinnerService.mostrarSpinner();
    this.tieneUsuarioPermisoAdministracion = this.permisosService.tienePermisoAdministracion();

    try {
      this.estadistica = await this.inicioService.obtenerEstadisticasPorIdUsuario(idUsuario)
                                                 .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
    }

    this.spinnerService.ocultarSpinner();
  }
}
