import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alerta } from 'src/app/clases/Alerta';
import { DatosFiltroPeritoYAseguradoraDTO } from 'src/app/interfaces/DTOs/filtro-perito-y-aseguradora';
import { ListadoPeritos } from 'src/app/interfaces/listadoPeritos';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';
import { FiltroPeritoAseguradoraComponent } from '../../filtros/perito/filtro-perito-aseguradora.component';
import { ListadoSiniestrosComponent } from '../listado-siniestros.component';

@Component({
  selector: 'app-listado-siniestros-perito-no-responsable',
  templateUrl: './perito-no-responsable.component.html',
  styleUrls: ['./perito-no-responsable.component.scss']
})
export class PeritoNoResponsableComponent extends ListadoSiniestrosComponent implements OnInit, ListadoPeritos {
  public siniestros: Siniestro[];
  private idPerito: number;

  @ViewChild(FiltroPeritoAseguradoraComponent)
  private filtroPeritoAseguradora: FiltroPeritoAseguradoraComponent;

  constructor(siniestrosService: SiniestrosService,
              injector: Injector,
              spinnerService: SpinnerService,
              private autenticacionService: AutenticacionService) {

    super(siniestrosService,
          injector.get(Router),
          injector.get(PermisosService),
          injector.get(ActivatedRoute),
          spinnerService);

    this.siniestros = [];
    this.idPerito = this.autenticacionService.obtenerIdUsuario();
  }

  async ngOnInit(): Promise<void> {
    this.spinnerService.mostrarSpinner();
    await this.obtenerSiniestros();

    this.filtroPeritoAseguradora.asignarAseguradoras(this.siniestros);
    this.spinnerService.ocultarSpinner();
  }

  private async obtenerSiniestros(): Promise<void> {
    try {
      this.siniestros = await this.siniestrosService.obtenerPorPeritoNoResponsable(this.idPerito, 0)
                                                    .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();
    }
  }

  public async filtrarSiniestros(datosFiltroPeritoYAseguradoraDTO: DatosFiltroPeritoYAseguradoraDTO): Promise<void> {
    let {idAseguradora} = datosFiltroPeritoYAseguradoraDTO;

    try {
      this.siniestros = await this.siniestrosService.obtenerPorPeritoNoResponsable(this.idPerito, idAseguradora)
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
