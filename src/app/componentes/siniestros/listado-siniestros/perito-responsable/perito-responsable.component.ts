import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alerta } from 'src/app/clases/Alerta';
import { DatosFiltroPeritoYAseguradoraDTO } from 'src/app/interfaces/DTOs/filtro-perito-y-aseguradora';
import { ListadoPeritos } from 'src/app/interfaces/listadoPeritos';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';
import { FiltroPeritoAseguradoraComponent } from '../../filtros/perito/filtro-perito-aseguradora.component';
import { ListadoSiniestrosComponent } from '../listado-siniestros.component';

@Component({
  selector: 'app-listado-siniestros-perito-responsable',
  templateUrl: './perito-responsable.component.html',
  styleUrls: ['./perito-responsable.component.scss']
})
export class PeritoResponsableComponent extends ListadoSiniestrosComponent implements OnInit, ListadoPeritos {
  public siniestros: Siniestro[];

  @ViewChild(FiltroPeritoAseguradoraComponent)
  private filtroPeritoAseguradora: FiltroPeritoAseguradoraComponent;

  constructor(siniestrosService: SiniestrosService,
              spinnerService: SpinnerService,
              private injector: Injector) {

    super(siniestrosService,
          injector.get(Router),
          injector.get(PermisosService),
          injector.get(ActivatedRoute),
          spinnerService);

    this.siniestros = [];
  }

  async ngOnInit(): Promise<void> {
    this.spinnerService.mostrarSpinner();
    await this.obtenerSiniestros();

    this.filtroPeritoAseguradora.asignarAseguradoras(this.siniestros);
    this.spinnerService.ocultarSpinner();
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

  verDetalles(idSiniestro: number): void {
    super.verDetalles(idSiniestro);
  }
}
