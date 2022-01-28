import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Alerta } from 'src/app/clases/Alerta';
import { AbrirSiniestroDto } from 'src/app/interfaces/DTOs/abrir-siniestro-dto';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';
import { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-listado-siniestros-administracion',
  templateUrl: './listado-siniestros-administracion.component.html',
  styleUrls: ['./listado-siniestros-administracion.component.scss']
})
export class ListadoSiniestrosAdministracionComponent implements OnInit {
  public siniestros: Siniestro[];

  @Output()
  public eventoVerDetalles: EventEmitter<number>;

  @Output()
  public eventoEditarSiniestro: EventEmitter<number>;

  constructor(private siniestrosService: SiniestrosService, private autenticacionService: AutenticacionService, private spinnerService: SpinnerService) {
    this.eventoVerDetalles = new EventEmitter<number>();
  }

  async ngOnInit(): Promise<void> {
    this.siniestrosService.siniestros = await this.siniestrosService.obtenerTodos(0, 0).toPromise();
    this.siniestros = this.siniestrosService.siniestros;
  }

  public async abrirSiniestro(idSiniestro: number): Promise<void> {
    let accionPregunta: SweetAlertResult = await Alerta.mostrarPreguntaAsincrono(`¿Está seguro que desea abrir el siniestro con id ${idSiniestro}?`);

    if (!accionPregunta.isConfirmed)
      return;

    let idUsuario: number = this.autenticacionService.obtenerIdUsuario();
    let abrirSiniestroDto: AbrirSiniestroDto = {
      idSiniestro,
      idUsuario
    };

    try {
      await this.siniestrosService.abrir(abrirSiniestroDto)
                                  .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();

      return;
    }

    await Alerta.mostrarOkAsincrono('Siniestro abierto correctamente');
    // this.filtrarSiniestros();
  }

  public emitirEventoVerDetalles(idSiniestro: number): void {
    this.eventoVerDetalles.emit(idSiniestro);
  }

  public emitirEventoEditarSiniestro(idSiniestro: number): void {
    this.eventoEditarSiniestro.emit(idSiniestro);
  }
}
