import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Alerta } from 'src/app/clases/Alerta';
import { AccionFormulario } from 'src/app/enumeraciones/accion-formulario.enum';
import { TipoEstado } from 'src/app/enumeraciones/tipo-estado.enum';
import { AbrirSiniestroDto } from 'src/app/interfaces/DTOs/abrir-siniestro-dto';
import { CerrarSiniestroDto } from 'src/app/interfaces/DTOs/cerrar-siniestro-dto';
import { CrearMensajeRevisarCierreDto } from 'src/app/interfaces/DTOs/crear-mensaje-revisar-cierre-dto';
import { DatosFiltroPeritoYAseguradoraDTO } from 'src/app/interfaces/DTOs/filtro-perito-y-aseguradora';
import { ImpValoracionDaniosSiniestroDto } from 'src/app/interfaces/DTOs/imp-valoracion-danios-siniestro-dto';
import { ListadoPeritos } from 'src/app/interfaces/listadoPeritos';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { MensajesService } from 'src/app/servicios/mensajes.service';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';
import { SweetAlertResult } from 'sweetalert2';
import { FiltroPeritoAseguradoraComponent } from '../../filtros/perito/filtro-perito-aseguradora.component';
import { ListadoSiniestrosComponent } from '../listado-siniestros.component';

@Component({
  selector: 'app-listado-siniestros-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.scss']
})
export class AdministracionComponent extends ListadoSiniestrosComponent implements OnInit, ListadoPeritos {
  public siniestros: Siniestro[];
  public tipoEstadoEnum: typeof TipoEstado = TipoEstado;

  @ViewChild(FiltroPeritoAseguradoraComponent)
  private filtroPeritoAseguradora: FiltroPeritoAseguradoraComponent;

  constructor(siniestrosService: SiniestrosService,
              router: Router,
              private autenticacionService: AutenticacionService,
              activatedRoute: ActivatedRoute,
              spinnerService: SpinnerService,
              private mensajesService: MensajesService,
              permisosService: PermisosService,
              private injector: Injector) {

    super(siniestrosService, router, permisosService, activatedRoute, spinnerService);

    this.siniestros = [];
  }

  async ngOnInit(): Promise<void> {
    this.spinnerService.mostrarSpinner();

    await this.obtenerSiniestros();
    this.spinnerService.ocultarSpinner();
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
    this.filtroPeritoAseguradora.eliminarFiltros();
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

  public async obtenerSiniestros(): Promise<void> {
    try {
      this.siniestros = await this.siniestrosService.obtenerTodos(0, 0)
                                                    .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();
    }
  }

  public editar(id: number): void {
    this.router.navigate([id, 'editar'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        tipoAccion: AccionFormulario.Editar
      }
    });
  }

  public async eliminar(id: number): Promise<void> {
    let accionPregunta: SweetAlertResult = await Alerta.mostrarPreguntaAsincrono(`¿Está seguro que desea eliminar el siniestro con id ${id}?`);

    if (!accionPregunta.isConfirmed)
      return;

    try {
      await this.siniestrosService.eliminar(id)
                                  .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();

      return;
    }

    await Alerta.mostrarOkAsincrono('Siniestro eliminado correctamente');
    this.filtroPeritoAseguradora.eliminarFiltros();
  }

  public crear(): void {
    this.router.navigate(['crear'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        tipoAccion: AccionFormulario.Crear
      }
    });
  }

  public verDetalles(idSiniestro: number): void {
    super.verDetalles(idSiniestro);
  }

  public async cerrarSiniestro(idSiniestro: number): Promise<void> {
    let accionPregunta: SweetAlertResult = await Alerta.mostrarPreguntaAsincrono(`¿Está seguro que desea cerrar el siniestro con id ${idSiniestro}?`);

    if (!accionPregunta.isConfirmed)
      return;

    let idUsuario: number = this.autenticacionService.obtenerIdUsuario();
    let impValoracionDaniosSiniestroDto: ImpValoracionDaniosSiniestroDto = {
      idSiniestro,
      idPerito: idUsuario
    };
    let esImpValoracionDaniosSiniestroMayorQuePerito: boolean;

    try {
      esImpValoracionDaniosSiniestroMayorQuePerito = await this.siniestrosService.esImpValoracionDaniosSiniestroMayorQuePerito(impValoracionDaniosSiniestroDto)
                                                                                 .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();

      return;
    }

    if (esImpValoracionDaniosSiniestroMayorQuePerito) {
      let accionPregunta: SweetAlertResult = await Alerta.mostrarPreguntaAsincrono('Se va a crear un mensaje para revisar el cierre porque el importe de valoración de daños ' +
                                                                                   'supera el establecido al perito. ¿Desea continuar?');

      if (!accionPregunta.isConfirmed)
        return;

      let crearMensajeRevisarCierreDto: CrearMensajeRevisarCierreDto = {
        idPerito: idUsuario,
        idSiniestro
      };

      try {
        await this.mensajesService.crearMensajeRevisarCierre(crearMensajeRevisarCierreDto)
                                  .toPromise();
      } catch (error: any) {
        Alerta.mostrarError(error);
        this.spinnerService.ocultarSpinner();

        return;
      }

      await Alerta.mostrarOkAsincrono('Mensaje revisar cierre creado correctamente');
      // this.filtrarSiniestros();

      return;
    }

    let idPermiso: number = this.permisosService.obtenerIdPermisoLogueado();
    let cerrarSiniestroDto: CerrarSiniestroDto = {
      idSiniestro,
      idPermiso,
      idPerito: idUsuario
    };

    try {
      await this.siniestrosService.cerrar(cerrarSiniestroDto)
                                  .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();

      return;
    }

    await Alerta.mostrarOkAsincrono('Siniestro cerrado correctamente');
    // this.filtrarSiniestros();
  }
}
