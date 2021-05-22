import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Documentacion } from 'src/app/interfaces/documentacion';
import { Imagen } from 'src/app/interfaces/imagen';
import { Mensaje } from 'src/app/interfaces/mensaje';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { DocumentacionesService } from 'src/app/servicios/documentaciones.service';
import { ImagenesService } from 'src/app/servicios/imagenes.service';
import { MensajesService } from 'src/app/servicios/mensajes.service';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-detalles-siniestro',
  templateUrl: './detalles-siniestro.component.html',
  styleUrls: ['./detalles-siniestro.component.scss']
})
export class DetallesSiniestroComponent implements OnInit {
  public siniestro: Siniestro;
  public documentaciones: Documentacion[];
  public imagenes: Imagen[];
  public mensajes: Mensaje[];

  constructor(private route: ActivatedRoute, private siniestrosService: SiniestrosService, private documentacionesService: DocumentacionesService,
              private router: Router, private imagenesService: ImagenesService, private permisosService: PermisosService,
              private mensajesService: MensajesService) { }

  async ngOnInit(): Promise<void> {
    let idSiniestro: number = Number(this.route.snapshot.paramMap.get('id'));
    this.siniestro = await this.siniestrosService.obtenerPorId(idSiniestro).toPromise();
    this.documentaciones = await this.documentacionesService.obtenerPorIdSiniestro(idSiniestro).toPromise();
    this.imagenes = await this.imagenesService.obtenerPorIdSiniestro(idSiniestro).toPromise();
    this.mensajes = await this.mensajesService.obtenerTodosPorIdSiniestro(idSiniestro).toPromise();
  }

  public tienePermisoAdministracion(): boolean {
    return this.permisosService.tienePermisoAdministracion();
  }

  async verArchivo(id: number): Promise<void> {
    let pdf: Blob = await this.documentacionesService.obtener(id).toPromise();
    
    let urlPdf = URL.createObjectURL(pdf);
    window.open(urlPdf, '_blank');
  }

  async verImagen(id: number): Promise<void> {
    let pdf: Blob = await (await this.imagenesService.obtener(id)).toPromise();
    
    let urlPdf = URL.createObjectURL(pdf);
    window.open(urlPdf, '_blank');
  }

  public subirDocumentacion(idSiniestro: number): void {
    this.router.navigate(['/subirDocumentacion', idSiniestro]);
  }

  public async eliminarDocumentacion(idDocumentacion: number): Promise<void> {
    let accion: SweetAlertResult = await Swal.fire({
      title: `¿Está seguro que desea eliminar la documentación con id ${idDocumentacion}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    });

    if (accion.isConfirmed) {      
      let respuesta: boolean = await this.documentacionesService.eliminar(idDocumentacion).toPromise();

      if (respuesta) {
        await Swal.fire({
          title: 'Documentación eliminada',
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar'
        });

        this.documentaciones = await this.documentacionesService.obtenerPorIdSiniestro(this.siniestro.id).toPromise();
      }        
      else
        Swal.fire({
          title: `Ha habido un problema al eliminar la documentación con id ${idDocumentacion}`,
          icon: 'error',          
          confirmButtonColor: '#3085d6',          
          confirmButtonText: 'Aceptar',          
        });
    }
  }

  public async eliminarMensaje(idMensaje: number): Promise<void> {
    let accion: SweetAlertResult = await Swal.fire({
      title: `¿Está seguro que desea eliminar el mensaje con id ${idMensaje}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    });

    if (accion.isConfirmed) {      
      let respuesta: boolean = await this.mensajesService.eliminar(idMensaje).toPromise();

      if (respuesta) {
        await Swal.fire({
          title: 'Mensaje eliminado',
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar'
        });

        this.mensajes = await this.mensajesService.obtenerTodosPorIdSiniestro(this.siniestro.id).toPromise();
      }        
      else
        Swal.fire({
          title: `Ha habido un problema al eliminar el mensaje con id ${idMensaje}`,
          icon: 'error',          
          confirmButtonColor: '#3085d6',          
          confirmButtonText: 'Aceptar',          
        });
    }
  }

  public subirImagen(idSiniestro: number): void {
    this.router.navigate(['/subirImagen', idSiniestro]);
  }

  public crearMensaje(idSiniestro: number): void {
    this.router.navigate(['/crearMensaje', idSiniestro]);
  }

  public async eliminarImagen(idImagen: number): Promise<void> {
    let accion: SweetAlertResult = await Swal.fire({
      title: `¿Está seguro que desea eliminar la imagen con id ${idImagen}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    });

    if (accion.isConfirmed) {      
      let respuesta: boolean = await this.imagenesService.eliminar(idImagen).toPromise();

      if (respuesta) {
        await Swal.fire({
          title: 'Imagen eliminada',
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar'
        });

        this.imagenes = await this.imagenesService.obtenerPorIdSiniestro(this.siniestro.id).toPromise();
      }        
      else
        Swal.fire({
          title: `Ha habido un problema al eliminar la imagen con id ${idImagen}`,
          icon: 'error',          
          confirmButtonColor: '#3085d6',          
          confirmButtonText: 'Aceptar',          
        });
    }
  }
}
