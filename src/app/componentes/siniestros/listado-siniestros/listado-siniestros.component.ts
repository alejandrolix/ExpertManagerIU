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
  public mostrarSpinner: boolean;

  constructor(private siniestrosService: SiniestrosService, private router: Router, private permisosService: PermisosService,
              private aseguradorasService: AseguradorasService, private usuariosService: UsuariosService, private peritosService: PeritosService,
              private mensajesService: MensajesService, private activatedRoute: ActivatedRoute) {

    this.siniestros = [];
    this.idPeritoSeleccionado = 0;
    this.idAseguradoraSeleccionada = 0;
    this.mostrarSpinner = true;
  }

  async ngOnInit(): Promise<void> {
    this.filtrarSiniestros(); 
    
    try {
      this.aseguradoras = await this.aseguradorasService.obtenerTodas()
                                    .toPromise();
    } catch (error) {
      Alerta.mostrarError(error);
    }

    try {
      this.peritos = await this.peritosService.obtenerTodos()
                               .toPromise();
    } catch (error) {
      Alerta.mostrarError(error);
    }
    
    this.mostrarSpinner = false;
  }

  public tienePermisoAdministracion(): boolean {
    return this.permisosService.tienePermisoAdministracion();
  }

  public async cerrarSiniestro(idSiniestro: number): Promise<void> {
    let esPeritoNoResponsable: boolean = this.permisosService.tienePermisoPeritoNoResponsable();

    if (esPeritoNoResponsable) {
      let idPeritoLogueado: number = this.usuariosService.obtenerIdUsuarioLogueado();
      let impReparacionDaniosPerito: number;

      try {
        impReparacionDaniosPerito = await this.peritosService.obtenerImpReparacionDaniosPorIdPerito(idPeritoLogueado)
                                              .toPromise();
      } catch (error) {
        Alerta.mostrarError(error);  
        return;
      }      

      let siniestroActual: Siniestro | undefined = this.siniestros.find(siniestro => siniestro.id == idSiniestro);

      if (siniestroActual === undefined) {
        Alerta.mostrarError(`No se ha encontrado el siniestro con id ${idSiniestro}`);
        return;
      }

      let impValDaniosCadena: string = siniestroActual.impValoracionDanios
                                                      .replace(',', '.')
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
        } catch (error) {
          Alerta.mostrarError(error);
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
    } catch (error) {
      Alerta.mostrarError(error);
      return;
    }            

    this.filtrarSiniestros();
  }

  public async filtrarSiniestros(): Promise<void> {
    if (this.permisosService.tienePermisoAdministracion())
      try {
        this.siniestros = await this.siniestrosService.obtenerTodos(this.idPeritoSeleccionado, this.idAseguradoraSeleccionada)
                                    .toPromise();
      } catch (error) {
        Alerta.mostrarError(error);
      }
    else {
      let idPerito: number = this.usuariosService.obtenerIdUsuarioLogueado();

      if (this.permisosService.tienePermisoPeritoResponsable())
        try {
          this.siniestros = await this.siniestrosService.obtenerPorPeritoResponsable(idPerito, this.idAseguradoraSeleccionada)
                                      .toPromise();
        } catch (error) {
          Alerta.mostrarError(error);
        }
      else
        try {
          this.siniestros = await this.siniestrosService.obtenerPorPeritoNoResponsable(idPerito, this.idAseguradoraSeleccionada)
                                      .toPromise();
        } catch (error) {
          Alerta.mostrarError(error);
        }       
    }
  }

  public eliminarFiltros(): void {
    this.idPeritoSeleccionado = 0;
    this.idAseguradoraSeleccionada = 0;
    
    this.filtrarSiniestros();
  }

  public editar(id: number): void {
    this.router.navigate(['editar', id], { relativeTo: this.activatedRoute });
  }

  public async eliminar(id: number): Promise<void> { 
    let accionPregunta: SweetAlertResult = await Alerta.mostrarPreguntaAsincrono(`¿Está seguro que desea eliminar el siniestro con id ${id}?`);   
    
    if (!accionPregunta.isConfirmed)
      return;

    try {
      await this.siniestrosService.eliminar(id)
                .toPromise(); 

      await Alerta.mostrarOkAsincrono('Siniestro eliminado correctamente');
    } catch (error) {
      Alerta.mostrarError(error);
      return;
    }            

    try {
      this.siniestros = await this.siniestrosService.obtenerTodos(this.idPeritoSeleccionado, this.idAseguradoraSeleccionada)
                                  .toPromise();
    } catch (error) {
      Alerta.mostrarError(error);   
    }        
  } 

  public crear(): void {
    this.router.navigate(['crear'], { relativeTo: this.activatedRoute });
  }

  public verDetalles(id: number): void {
    this.router.navigate(['detalles', id], { relativeTo: this.activatedRoute });
  }
}
