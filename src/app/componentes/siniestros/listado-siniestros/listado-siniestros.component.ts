import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alerta } from 'src/app/clases/Alerta';
import { CerrarSiniestroDto } from 'src/app/interfaces/DTOs/cerrar-siniestro-dto';
import { AccionFormulario } from 'src/app/enumeraciones/accion-formulario.enum';
import { Aseguradora } from 'src/app/interfaces/aseguradora';
import { CrearMensajeRevisarCierreDto } from 'src/app/interfaces/DTOs/crear-mensaje-revisar-cierre-dto';
import { ImpValoracionDaniosSiniestroDto } from 'src/app/interfaces/DTOs/imp-valoracion-danios-siniestro-dto';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { Usuario } from 'src/app/interfaces/usuario';
import { AseguradorasService } from 'src/app/servicios/aseguradoras.service';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { MensajesService } from 'src/app/servicios/mensajes.service';
import { PeritosService } from 'src/app/servicios/peritos.service';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';
import { SweetAlertResult } from 'sweetalert2';
import { AbrirSiniestroDto } from 'src/app/interfaces/DTOs/abrir-siniestro-dto';
import { TipoEstado } from 'src/app/enumeraciones/tipo-estado.enum';

@Component({
  selector: 'app-listado-siniestros',
  templateUrl: './listado-siniestros.component.html',
  styleUrls: ['./listado-siniestros.component.scss']
})
export class ListadoSiniestrosComponent implements OnInit {
  public siniestros: Siniestro[];
  public peritos: Usuario[];
  public aseguradoras: Aseguradora[];
  public tipoEstadoEnum: typeof TipoEstado = TipoEstado;
  public tienePermisoAdministracion: boolean;

  constructor(private siniestrosService: SiniestrosService, private router: Router, private permisosService: PermisosService,
              private aseguradorasService: AseguradorasService, private autenticacionService: AutenticacionService, private peritosService: PeritosService,
              private mensajesService: MensajesService, private activatedRoute: ActivatedRoute, private spinnerService: SpinnerService) {

    this.siniestros = [];
  }

  async ngOnInit(): Promise<void> {
    this.spinnerService.mostrarSpinner();
    this.tienePermisoAdministracion = this.permisosService.tienePermisoAdministracion();

    try {
      this.aseguradoras = await this.aseguradorasService.obtenerTodas()
                                                        .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();

      return;
    }

    this.aseguradoras.unshift({
      id: 0,
      nombre: 'Todas'
    });
    this.siniestrosService.idAseguradoraSeleccionada = 0;

    try {
      this.peritos = await this.peritosService.obtenerTodos()
                                              .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();

      return;
    }

    this.peritos.unshift({
      id: 0,
      nombre: 'Todos',
      idEsPerito: 0,
      esPerito: '',
      idPermiso: 0,
      permiso: '',
      hashContrasenia: '',
      impReparacionDanios: 0,
      token: ''
    });
    this.siniestrosService.idPeritoSeleccionado = 0;

    this.filtrarSiniestros();
    this.spinnerService.ocultarSpinner();
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
      let accionPregunta: SweetAlertResult = await Alerta.mostrarPreguntaAsincrono('Se va a crear un mensaje para revisar el cierre porque el importe de valoración de daños supera el establecido al perito. ¿Desea continuar?');

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
      this.filtrarSiniestros();

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
    this.filtrarSiniestros();
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
    this.filtrarSiniestros();
  }

  public async filtrarSiniestros(): Promise<void> {
    let tienePermisoAdministracion: boolean = this.permisosService.tienePermisoAdministracion();
    let vaciarListaSiniestros: boolean = false;

    if (tienePermisoAdministracion) {
      this.obtenerSiniestrosPermisoAdministracion();
      vaciarListaSiniestros = true;
    }
    else {
      let idPerito: number = 0;

      try {
        idPerito = this.autenticacionService.obtenerIdUsuario();
      } catch (error: any) {
        Alerta.mostrarError(error.message);
        this.spinnerService.ocultarSpinner();

        return;
      }

      let tienePermisoPeritoResponsable: boolean = false;

      try {
        tienePermisoPeritoResponsable = this.permisosService.tienePermisoPeritoResponsable();
      } catch (error: any) {
        Alerta.mostrarError(error.message);
        this.spinnerService.ocultarSpinner();

        return;
      }

      if (tienePermisoPeritoResponsable) {
        this.obtenerSiniestrosPorPeritoResponsable(idPerito);
        vaciarListaSiniestros = true;
      }
      else {
        this.obtenerSiniestrosPorPeritoNoResponsable(idPerito);
        vaciarListaSiniestros = true;
      }
    }

    if (vaciarListaSiniestros)
      this.siniestros = [];
  }

  public asignarPeritoSeleccionado(evento: any): void {
    let idPeritoSeleccionado = parseInt(evento.target.value);
    this.siniestrosService.idPeritoSeleccionado = idPeritoSeleccionado;
  }

  public asignarAseguradoraSeleccionada(evento: any): void {
    let idAseguradoraSeleccionada = parseInt(evento.target.value);
    this.siniestrosService.idPeritoSeleccionado = idAseguradoraSeleccionada;
  }

  private async obtenerSiniestrosPermisoAdministracion(): Promise<void> {
    try {
      this.siniestros = await this.siniestrosService.obtenerTodos(this.siniestrosService.idPeritoSeleccionado, this.siniestrosService.idAseguradoraSeleccionada)
                                                    .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();
    }
  }

  private async obtenerSiniestrosPorPeritoResponsable(idPerito: number): Promise<void> {
    try {
      this.siniestros = await this.siniestrosService.obtenerPorPeritoResponsable(idPerito, this.siniestrosService.idAseguradoraSeleccionada)
                                                    .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();
    }
  }

  private async obtenerSiniestrosPorPeritoNoResponsable(idPerito: number): Promise<void> {
    try {
      this.siniestros = await this.siniestrosService.obtenerPorPeritoNoResponsable(idPerito, this.siniestrosService.idAseguradoraSeleccionada)
                                                    .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();
    }
  }

  public eliminarFiltros(): void {
    this.siniestrosService.idPeritoSeleccionado = 0;
    this.siniestrosService.idAseguradoraSeleccionada = 0;

    this.filtrarSiniestros();
  }

  public editar(id: number): void {
    this.router.navigate([id, 'editar'], { relativeTo: this.activatedRoute, queryParams: { tipoAccion: AccionFormulario.Editar } });
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
    this.filtrarSiniestros();
  }

  public crear(): void {
    this.router.navigate(['crear'], { relativeTo: this.activatedRoute, queryParams: { tipoAccion: AccionFormulario.Crear } });
  }

  public verDetalles(id: number): void {
    this.router.navigate([id, 'detalles'], { relativeTo: this.activatedRoute });
  }
}
