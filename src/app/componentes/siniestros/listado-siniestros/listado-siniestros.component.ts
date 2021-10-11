import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alerta } from 'src/app/clases/Alerta';
import { Aseguradora } from 'src/app/interfaces/aseguradora';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { Usuario } from 'src/app/interfaces/usuario';
import { AseguradorasService } from 'src/app/servicios/aseguradoras.service';
import { MensajesService } from 'src/app/servicios/mensajes.service';
import { PeritosService } from 'src/app/servicios/peritos.service';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-listado-siniestros',
  templateUrl: './listado-siniestros.component.html',
  styleUrls: ['./listado-siniestros.component.scss']
})
export class ListadoSiniestrosComponent implements OnInit {
  public siniestros: Siniestro[];
  public peritos: Usuario[];
  public aseguradoras: Aseguradora[];
  public idPeritoSeleccionado: number;
  public idAseguradoraSeleccionada: number;

  constructor(private siniestrosService: SiniestrosService, private router: Router, private permisosService: PermisosService,
              private aseguradorasService: AseguradorasService, private usuariosService: UsuariosService, private peritosService: PeritosService,
              private mensajesService: MensajesService, private activatedRoute: ActivatedRoute, private spinnerService: SpinnerService) {

    this.siniestros = [];
    this.idPeritoSeleccionado = 0;
    this.idAseguradoraSeleccionada = 0;
  }

  async ngOnInit(): Promise<void> {
    this.spinnerService.mostrarSpinner();
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
    this.idAseguradoraSeleccionada = 0;

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
    this.idPeritoSeleccionado = 0;

    this.filtrarSiniestros();             
    this.spinnerService.ocultarSpinner();
  }

  public tienePermisoAdministracion(): boolean {
    return this.permisosService.tienePermisoAdministracion();
  }

  public async cerrarSiniestro(idSiniestro: number): Promise<void> {
    let esPeritoNoResponsable: boolean = false;

    try {      
      esPeritoNoResponsable = this.permisosService.tienePermisoPeritoNoResponsable();
    } catch (error: any) {
      Alerta.mostrarError(error.message);  
      this.spinnerService.ocultarSpinner();
        
      return;
    }

    if (esPeritoNoResponsable) {
      let idPeritoLogueado: number = this.usuariosService.obtenerIdUsuarioLogueado();
      let impReparacionDaniosPerito: number;

      try {
        impReparacionDaniosPerito = await this.peritosService.obtenerImpReparacionDaniosPorIdPerito(idPeritoLogueado)
                                                             .toPromise();
      } catch (error: any) {
        Alerta.mostrarError(error);  
        this.spinnerService.ocultarSpinner();
        
        return;
      }      

      let siniestroActual: Siniestro | undefined = this.siniestros.find(siniestro => siniestro.id == idSiniestro);

      if (siniestroActual === undefined) {
        Alerta.mostrarError(`No se ha encontrado el siniestro con id ${idSiniestro}`);
        return;
      }

      let impValDaniosCadena: string = siniestroActual.impValoracionDanios.replace(',', '.')
                                                                          .replace(' €', '');

      let impValoracionDaniosSiniestro: number = Number(impValDaniosCadena);

      if (impValoracionDaniosSiniestro > impReparacionDaniosPerito) {
        await Alerta.mostrarErrorAsincrono('No puede cerrar el siniestro porque el importe de valoración de daños supera el establecido al perito');

        let idUsuarioCreado: number = this.usuariosService.obtenerIdUsuarioLogueado();
        let mensaje = {
          idUsuarioCreado: idUsuarioCreado,
          idSiniestro: idSiniestro
        };

        try {
          await this.mensajesService.crearMensajeRevisarCierre(mensaje)
                                    .toPromise(); 
        } catch (error: any) {
          Alerta.mostrarError(error);
          this.spinnerService.ocultarSpinner();
        }        
      }
      else
        this.mostrarAlertaCerrarSiniestro(idSiniestro);
    } 
    else
      this.mostrarAlertaCerrarSiniestro(idSiniestro);  
  }

  private async mostrarAlertaCerrarSiniestro(idSiniestro: number): Promise<void> {
    let accionPregunta: SweetAlertResult = await Alerta.mostrarPreguntaAsincrono(`¿Está seguro que desea cerrar el siniestro con id ${idSiniestro}?`);

    if (!accionPregunta.isConfirmed)
      return;
 
    try {
      await this.siniestrosService.cerrar(idSiniestro)
                                  .toPromise(); 
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();

      return;
    }            

    this.filtrarSiniestros();
  }

  public async filtrarSiniestros(): Promise<void> {    
    let vaciarSiniestros: boolean = false;

    if (this.permisosService.tienePermisoAdministracion())
      try {
        this.siniestros = await this.siniestrosService.obtenerTodos(this.idPeritoSeleccionado, this.idAseguradoraSeleccionada)
                                                      .toPromise();
      } catch (error: any) {
        Alerta.mostrarError(error);
        this.spinnerService.ocultarSpinner();
        vaciarSiniestros = true;
      }
    else {
      let idPerito: number = 0;

      try {        
        idPerito = this.usuariosService.obtenerIdUsuarioLogueado();
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

      if (tienePermisoPeritoResponsable)
        try {
          this.siniestros = await this.siniestrosService.obtenerPorPeritoResponsable(idPerito, this.idAseguradoraSeleccionada)
                                                        .toPromise();
        } catch (error: any) {
          Alerta.mostrarError(error);
          this.spinnerService.ocultarSpinner();
          vaciarSiniestros = true;
        }
      else
        try {
          this.siniestros = await this.siniestrosService.obtenerPorPeritoNoResponsable(idPerito, this.idAseguradoraSeleccionada)
                                                        .toPromise();
        } catch (error: any) {
          Alerta.mostrarError(error);
          this.spinnerService.ocultarSpinner();
          vaciarSiniestros = true;
        }       
    }

    if (vaciarSiniestros)
      this.siniestros = [];
  }

  public eliminarFiltros(): void {
    this.idPeritoSeleccionado = 0;
    this.idAseguradoraSeleccionada = 0;
    
    this.filtrarSiniestros();
  }

  public editar(id: number): void {
    this.router.navigate([id, 'editar'], { relativeTo: this.activatedRoute });
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
    this.router.navigate(['crear'], { relativeTo: this.activatedRoute });
  }

  public verDetalles(id: number): void {
    this.router.navigate([id, 'detalles'], { relativeTo: this.activatedRoute });
  }
}
