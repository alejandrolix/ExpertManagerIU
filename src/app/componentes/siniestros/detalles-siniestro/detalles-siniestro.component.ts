import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Alerta } from 'src/app/clases/Alerta';
import { TipoArchivo } from 'src/app/enumeraciones/tipo-archivo.enum';
import { Archivo } from 'src/app/interfaces/archivo';
import { Mensaje } from 'src/app/interfaces/mensaje';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { DocumentacionesService } from 'src/app/servicios/documentaciones.service';
import { ImagenesService } from 'src/app/servicios/imagenes.service';
import { MensajesService } from 'src/app/servicios/mensajes.service';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';
import { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-detalles-siniestro',
  templateUrl: './detalles-siniestro.component.html',
  styleUrls: ['./detalles-siniestro.component.scss']
})
export class DetallesSiniestroComponent implements OnInit {
  public siniestro: Siniestro;
  public documentaciones: Archivo[];
  public imagenes: Archivo[];
  public mensajes: Mensaje[];

  constructor(private route: ActivatedRoute, private siniestrosService: SiniestrosService, private documentacionesService: DocumentacionesService,
              private router: Router, private imagenesService: ImagenesService, private permisosService: PermisosService,
              private mensajesService: MensajesService, private spinnerService: SpinnerService) { }

  async ngOnInit(): Promise<void> {
    this.spinnerService.mostrarSpinner();
    let idSiniestro: number = Number(this.route.snapshot
                                               .paramMap
                                               .get('id'));
    try {
      this.siniestro = await firstValueFrom(this.siniestrosService.obtenerPorId(idSiniestro));
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();

      return;
    }

    try {
      this.documentaciones = await firstValueFrom(this.documentacionesService.obtenerPorIdSiniestro(idSiniestro));
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();

      return;
    }

    try {
      this.imagenes = await firstValueFrom(this.imagenesService.obtenerPorIdSiniestro(idSiniestro));
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();

      return;
    }

    await this.obtenerMensajes();
    this.spinnerService.ocultarSpinner();
  }

  private async obtenerMensajes(): Promise<void> {
    try {
      this.mensajes = await firstValueFrom(this.mensajesService.obtenerTodosPorIdSiniestro(this.siniestro.id));
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();

      return;
    }
  }

  public tienePermisoAdministracion(): boolean {
    return this.permisosService.tienePermisoAdministracion();
  }

  async verArchivo(id: number): Promise<void> {
    let pdf: Blob;

    try {
      pdf = await firstValueFrom(this.documentacionesService.obtener(id));
    } catch (error: any) {
      Alerta.mostrarError(error);
      return;
    }

    let urlPdf = URL.createObjectURL(pdf);
    window.open(urlPdf, '_blank');
  }

  async verImagen(id: number): Promise<void> {
    let imagen: Blob;

    try {
      imagen = await firstValueFrom(this.imagenesService.obtener(id));
    } catch (error: any) {
      Alerta.mostrarError(error);
      return;
    }

    let urlImagen = URL.createObjectURL(imagen);
    window.open(urlImagen, '_blank');
  }

  public subirDocumentacion(): void {
    this.router.navigate(['/siniestros', this.siniestro.id, 'documentaciones', 'subir'], {
      queryParams: {
        tipoArchivo: TipoArchivo.Documento
      }
    });
  }

  public async eliminarDocumentacion(idDocumentacion: number): Promise<void> {
    let accion: SweetAlertResult = await Alerta.mostrarPreguntaAsincrono(`¿Está seguro que desea eliminar la documentación con id ${idDocumentacion}?`);

    if (accion.isConfirmed) {
      let respuesta: boolean;

      try {
        respuesta = await firstValueFrom(this.documentacionesService.eliminar(idDocumentacion));
      } catch (error: any) {
        Alerta.mostrarError(error);
        return;
      }

      if (respuesta) {
        await Alerta.mostrarOkAsincrono('Documentación eliminada');

        try {
          this.documentaciones = await firstValueFrom(this.documentacionesService.obtenerPorIdSiniestro(this.siniestro.id));
        } catch (error: any) {
          Alerta.mostrarError(error);
        }
      }
    }
  }

  public async eliminarMensaje(idMensaje: number): Promise<void> {
    let accion: SweetAlertResult = await Alerta.mostrarPreguntaAsincrono(`¿Está seguro que desea eliminar el mensaje con id ${idMensaje}?`);

    if (accion.isConfirmed) {
      let respuesta: boolean;

      try {
        respuesta = await firstValueFrom(this.mensajesService.eliminar(idMensaje));
      } catch (error: any) {
        Alerta.mostrarError(error);

        return;
      }

      if (respuesta) {
        await Alerta.mostrarOkAsincrono('Mensaje eliminado');
        await this.obtenerMensajes();
      }
    }
  }

  public subirImagen(): void {
    this.router.navigate(['/siniestros', this.siniestro.id, 'imagenes', 'subir'], {
      queryParams: {
        tipoArchivo: TipoArchivo.Imagen
      }
    });
  }

  public crearMensaje(): void {
    this.router.navigate(['/siniestros', this.siniestro.id, 'mensajes', 'crear']);
  }

  public async eliminarImagen(idImagen: number): Promise<void> {
    let accion: SweetAlertResult = await Alerta.mostrarPreguntaAsincrono(`¿Está seguro que desea eliminar la imagen con id ${idImagen}?`);

    if (accion.isConfirmed) {
      let respuesta: boolean;

      try {
        respuesta = await firstValueFrom(this.imagenesService.eliminar(idImagen));
      } catch (error: any) {
        Alerta.mostrarError(error);
        return;
      }

      if (respuesta) {
        await Alerta.mostrarOkAsincrono('Imagen eliminada');

        try {
          this.imagenes = await firstValueFrom(this.imagenesService.obtenerPorIdSiniestro(this.siniestro.id));
        } catch (error: any) {
          Alerta.mostrarError(error);
        }
      }
    }
  }
}
