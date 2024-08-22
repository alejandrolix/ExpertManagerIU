import { Component, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Alerta } from 'src/app/clases/Alerta';
import { AccionFormulario } from 'src/app/enumeraciones/accion-formulario.enum';
import { TipoEstado } from 'src/app/enumeraciones/tipo-estado.enum';
import { AbrirSiniestroDto } from 'src/app/interfaces/DTOs/siniestro/abrir-siniestro-dto';
import { CerrarSiniestroDto } from 'src/app/interfaces/DTOs/siniestro/cerrar-siniestro-dto';
import { CrearMensajeRevisarCierreDto } from 'src/app/interfaces/DTOs/crear-mensaje-revisar-cierre-dto';
import { DatosFiltroPeritoYAseguradoraDTO } from 'src/app/interfaces/DTOs/filtro-perito-y-aseguradora';
import { ImpValoracionDaniosSiniestroDto } from 'src/app/interfaces/DTOs/siniestro/imp-valoracion-danios-siniestro-dto';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { MensajesService } from 'src/app/servicios/mensajes.service';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';
import { SweetAlertResult } from 'sweetalert2';
import { FiltroPeritoAseguradora } from '../filtros/perito/filtro-perito-aseguradora';

@Component({
  selector: 'app-listado-siniestros',
  templateUrl: './listado-siniestros.component.html',
  styleUrls: ['./listado-siniestros.component.scss']
})
export class ListadoSiniestrosComponent implements OnInit {
  public siniestros: WritableSignal<Siniestro[]>;
  public tipoEstadoEnum: typeof TipoEstado = TipoEstado;
  private _tienePermisoAdministracion: boolean;

  @ViewChild(FiltroPeritoAseguradora)
  private filtroPeritoAseguradora: FiltroPeritoAseguradora;

  constructor(private siniestrosService:    SiniestrosService,
              private router:               Router,
              private autenticacionService: AutenticacionService,
              private activatedRoute:       ActivatedRoute,
              private spinnerService:       SpinnerService,
              private mensajesService:      MensajesService,
              private permisosService:      PermisosService) { }

  public async ngOnInit(): Promise<void> {
    this.siniestros = signal([]);
    this.spinnerService.mostrarSpinner();
    this._tienePermisoAdministracion = this.permisosService.tienePermisoAdministracion();
    
    let siniestros: Siniestro[] = await this.obtenerSiniestros(0, 0);
    this.siniestros.set(siniestros);

    this.spinnerService.ocultarSpinner();
  }

  public get tienePermisoAdministracion(): boolean {
    return this._tienePermisoAdministracion;
  }

  public async abrirSiniestro(idSiniestro: number): Promise<void> {
    let accionPregunta: SweetAlertResult = await Alerta.mostrarPreguntaAsincrono(`¿Está seguro que desea abrir el siniestro con id ${idSiniestro}?`);

    if (!accionPregunta.isConfirmed) {
      return;
    }

    let idUsuario: number = this.autenticacionService.obtenerIdUsuario();
    let abrirSiniestroDto: AbrirSiniestroDto = {
      idSiniestro,
      idUsuario
    };

    await firstValueFrom(this.siniestrosService.abrir(abrirSiniestroDto));

    await Alerta.mostrarOkAsincrono('Siniestro abierto correctamente');
    this.filtroPeritoAseguradora.eliminarFiltros();
  }

  public async filtrarSiniestros(datosFiltroPeritoYAseguradoraDTO: DatosFiltroPeritoYAseguradoraDTO): Promise<void> {
    let {idPerito, idAseguradora} = datosFiltroPeritoYAseguradoraDTO;
    let siniestros: Siniestro[] = await this.obtenerSiniestros(idPerito, idAseguradora);

    this.siniestros.set(siniestros);
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

    if (!accionPregunta.isConfirmed) {
      return;
    }

    await firstValueFrom(this.siniestrosService.eliminar(id));

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
    this.router.navigate([idSiniestro, 'detalles'], {
      relativeTo: this.activatedRoute
    });
  }

  public async cerrarSiniestro(idSiniestro: number): Promise<void> {
    let accionPregunta: SweetAlertResult = await Alerta.mostrarPreguntaAsincrono(`¿Está seguro que desea cerrar el siniestro con id ${idSiniestro}?`);

    if (!accionPregunta.isConfirmed) {
      return;
    }

    let idUsuario: number = this.autenticacionService.obtenerIdUsuario();
    let impValoracionDaniosSiniestroDto: ImpValoracionDaniosSiniestroDto = {
      idSiniestro,
      idPerito: idUsuario
    };
    let esImpValoracionDaniosMayorQuePerito: boolean;

    esImpValoracionDaniosMayorQuePerito = await firstValueFrom(this.siniestrosService.esImpValoracionDaniosSiniestroMayorQuePerito(impValoracionDaniosSiniestroDto));

    if (esImpValoracionDaniosMayorQuePerito) {
      let mensaje: string = 'Se va a crear un mensaje para revisar el cierre porque el importe de valoración de daños supera el establecido al perito. ¿Desea continuar?';
      let accionPregunta: SweetAlertResult = await Alerta.mostrarPreguntaAsincrono(mensaje);

      if (!accionPregunta.isConfirmed) {
        return;
      }

      let crearMensajeRevisarCierreDto: CrearMensajeRevisarCierreDto = {
        idPerito: idUsuario,
        idSiniestro
      };

      await firstValueFrom(this.mensajesService.crearMensajeRevisarCierre(crearMensajeRevisarCierreDto));

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

    await firstValueFrom(this.siniestrosService.cerrar(cerrarSiniestroDto));

    await Alerta.mostrarOkAsincrono('Siniestro cerrado correctamente');
    this.filtroPeritoAseguradora.eliminarFiltros();
  }

  private async obtenerSiniestros(idPerito: number, idAseguradora: number): Promise<Siniestro[]> {
    let esPeritoResponsable: boolean = this.permisosService.tienePermisoPeritoResponsable();
    let esPeritoNoResponsable: boolean = this.permisosService.tienePermisoPeritoNoResponsable();
    let siniestros: Siniestro[] = [];

    if (this.tienePermisoAdministracion) {
      siniestros = await firstValueFrom(this.siniestrosService.obtenerTodos(idPerito, idAseguradora));
    }
    else if (esPeritoResponsable) {
      siniestros = await firstValueFrom(this.siniestrosService.obtenerPorPeritoResponsable(idPerito, idAseguradora));
    }
    else if (esPeritoNoResponsable) {
      siniestros = await firstValueFrom(this.siniestrosService.obtenerPorPeritoNoResponsable(idPerito, idAseguradora));
    }
    
    return siniestros;
  }
}
