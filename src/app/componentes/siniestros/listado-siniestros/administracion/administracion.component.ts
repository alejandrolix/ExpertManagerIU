import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Alerta } from 'src/app/clases/Alerta';
import { AccionFormulario } from 'src/app/enumeraciones/accion-formulario.enum';
import { TipoEstado } from 'src/app/enumeraciones/tipo-estado.enum';
import { AbrirSiniestroDto } from 'src/app/interfaces/DTOs/siniestro/abrir-siniestro-dto';
import { CerrarSiniestroDto } from 'src/app/interfaces/DTOs/siniestro/cerrar-siniestro-dto';
import { CrearMensajeRevisarCierreDto } from 'src/app/interfaces/DTOs/crear-mensaje-revisar-cierre-dto';
import { DatosFiltroPeritoYAseguradoraDTO, NombreDesplegableFiltro } from 'src/app/interfaces/DTOs/filtro-perito-y-aseguradora';
import { ImpValoracionDaniosSiniestroDto } from 'src/app/interfaces/DTOs/siniestro/imp-valoracion-danios-siniestro-dto';
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
  public override siniestros: Siniestro[];
  public tipoEstadoEnum: typeof TipoEstado = TipoEstado;

  @ViewChild(FiltroPeritoAseguradoraComponent)
  private filtroPeritoAseguradora: FiltroPeritoAseguradoraComponent;

  constructor(siniestrosService: SiniestrosService,
              router: Router,
              private autenticacionService: AutenticacionService,
              activatedRoute: ActivatedRoute,
              spinnerService: SpinnerService,
              private mensajesService: MensajesService,
              permisosService: PermisosService) {

    super(siniestrosService, router, permisosService, activatedRoute, spinnerService);

    this.siniestros = [];
  }

  override async ngOnInit(): Promise<void> {
    this.spinnerService.mostrarSpinner();

    this.siniestros = await firstValueFrom(this.siniestrosService.obtenerTodos(0, 0));
    this.filtroPeritoAseguradora.asignarPeritos(this.siniestros);
    this.filtroPeritoAseguradora.asignarAseguradoras(this.siniestros);
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

    await this.siniestrosService.abrir(abrirSiniestroDto)
                                .toPromise();

    await Alerta.mostrarOkAsincrono('Siniestro abierto correctamente');
    this.filtroPeritoAseguradora.eliminarFiltros();
  }

  public async filtrarSiniestros(datosFiltroPeritoYAseguradoraDTO: DatosFiltroPeritoYAseguradoraDTO): Promise<void> {
    let {idPerito, idAseguradora, nombreDesplegable} = datosFiltroPeritoYAseguradoraDTO;

    this.siniestros = await firstValueFrom(this.siniestrosService.obtenerTodos(idPerito, idAseguradora));

    // Asignamos las aseguradoras obtenidas según el perito seleccionado.
    if (nombreDesplegable !== NombreDesplegableFiltro.Aseguradora) {
      this.filtroPeritoAseguradora.asignarAseguradoras(this.siniestros);
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

    await this.siniestrosService.eliminar(id)
                                .toPromise();

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

  public override verDetalles(idSiniestro: number): void {
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

    esImpValoracionDaniosSiniestroMayorQuePerito = await firstValueFrom(this.siniestrosService.esImpValoracionDaniosSiniestroMayorQuePerito(impValoracionDaniosSiniestroDto));

    if (esImpValoracionDaniosSiniestroMayorQuePerito) {
      let accionPregunta: SweetAlertResult = await Alerta.mostrarPreguntaAsincrono('Se va a crear un mensaje para revisar el cierre porque el importe de valoración de daños ' +
                                                                                   'supera el establecido al perito. ¿Desea continuar?');

      if (!accionPregunta.isConfirmed)
        return;

      let crearMensajeRevisarCierreDto: CrearMensajeRevisarCierreDto = {
        idPerito: idUsuario,
        idSiniestro
      };

      await this.mensajesService.crearMensajeRevisarCierre(crearMensajeRevisarCierreDto)
                                .toPromise();

      await Alerta.mostrarOkAsincrono('Mensaje revisar cierre creado correctamente');
      this.filtroPeritoAseguradora.eliminarFiltros();

      return;
    }

    let idPermiso: number = this.permisosService.obtenerIdPermisoLogueado();
    let cerrarSiniestroDto: CerrarSiniestroDto = {
      idSiniestro,
      idPermiso,
      idPerito: idUsuario
    };

    await this.siniestrosService.cerrar(cerrarSiniestroDto)
                                .toPromise();

    await Alerta.mostrarOkAsincrono('Siniestro cerrado correctamente');
    this.filtroPeritoAseguradora.eliminarFiltros();
  }
}
