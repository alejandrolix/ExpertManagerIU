import { Component, Injector, OnInit } from '@angular/core';
import { Alerta } from 'src/app/clases/Alerta';
import { DatosFiltroPeritoYAseguradoraDTO } from 'src/app/interfaces/DTOs/filtro-perito-y-aseguradora';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';
import { ListadoSiniestrosComponent } from '../listado-siniestros.component';

@Component({
  selector: 'app-listado-siniestros-perito-responsable',
  templateUrl: './perito-responsable.component.html',
  styleUrls: ['./perito-responsable.component.scss']
})
export class PeritoResponsableComponent implements OnInit {
  public siniestros: Siniestro[];

  constructor(private siniestrosService: SiniestrosService,
              private spinnerService: SpinnerService,
              private injector: Injector) { }

  ngOnInit(): void {
    this.obtenerSiniestros();
  }

  private async obtenerSiniestros(): Promise<void> {
    try {
      this.siniestros = await this.siniestrosService.obtenerPorPeritoResponsable(0, 0)
                                                    .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();
    }
  }

  public async filtrarSiniestros(datosFiltroPeritoYAseguradoraDTO: DatosFiltroPeritoYAseguradoraDTO): Promise<void> {
    let {idPerito, idAseguradora} = datosFiltroPeritoYAseguradoraDTO;

    try {
      this.siniestros = await this.siniestrosService.obtenerTodos(idPerito, idAseguradora)
                                                    .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();
    }
  }

  public verDetalles(id: number): void {
    let componenteListadoSiniestros: ListadoSiniestrosComponent | undefined;
    componenteListadoSiniestros = this.injector.get(ListadoSiniestrosComponent);

    if (componenteListadoSiniestros == undefined) {
      Alerta.mostrarError(`No se puede mostrar los detalles del siniestro id ${id}`);
      return;
    }

    componenteListadoSiniestros.verDetalles(id);
  }
}
