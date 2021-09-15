import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alerta } from 'src/app/clases/Alerta';
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
  public mostrarSpinner: boolean;

  constructor(private route: ActivatedRoute, private siniestrosService: SiniestrosService, private documentacionesService: DocumentacionesService,
              private router: Router, private imagenesService: ImagenesService, private permisosService: PermisosService,
              private mensajesService: MensajesService) {

    this.mostrarSpinner = true;
  }

  async ngOnInit(): Promise<void> {
    let idSiniestro: number = Number(this.route.snapshot.paramMap.get('id'));

    try {
      this.siniestro = await this.siniestrosService.obtenerPorId(idSiniestro)
                                                   .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.mostrarSpinner = false;
      
      return;
    }

    try {
      this.documentaciones = await this.documentacionesService.obtenerPorIdSiniestro(idSiniestro)
                                                              .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);

      this.mostrarSpinner = false;
      return;
    }

    try {
      this.imagenes = await this.imagenesService.obtenerPorIdSiniestro(idSiniestro)
                                                .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);

      this.mostrarSpinner = false;
      return;
    }
    
    try {
      this.mensajes = await this.mensajesService.obtenerTodosPorIdSiniestro(idSiniestro)
                                                .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);

      this.mostrarSpinner = false;
      return;
    }    

    this.mostrarSpinner = false;
  }

  public tienePermisoAdministracion(): boolean {
    return this.permisosService.tienePermisoAdministracion();
  }

  async verArchivo(id: number): Promise<void> {
    let pdf: Blob;

    try {
      pdf = await this.documentacionesService.obtener(id).toPromise(); 
    } catch (error) {
      await Swal.fire({
        title: 'Ha habido un error al obtener la documentación. Inténtelo de nuevo',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });

      return;
    }    
    
    let urlPdf = URL.createObjectURL(pdf);
    window.open(urlPdf, '_blank');
  }

  async verImagen(id: number): Promise<void> {
    let pdf: Blob;

    try {
      pdf = await (await this.imagenesService.obtener(id)).toPromise();
    } catch (error) {
      await Swal.fire({
        title: 'Ha habido un error al obtener la imagen. Inténtelo de nuevo',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });

      return;
    }    
    
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
      let respuesta: boolean;

      try {
        respuesta = await this.documentacionesService.eliminar(idDocumentacion).toPromise(); 
      } catch (error) {
        await Swal.fire({
          title: 'Ha habido un error al obtener eliminar la documentación. Inténtelo de nuevo',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
  
        return;
      }      

      if (respuesta) {
        await Swal.fire({
          title: 'Documentación eliminada',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar'
        });

        try {
          this.documentaciones = await this.documentacionesService.obtenerPorIdSiniestro(this.siniestro.id).toPromise(); 
        } catch (error) {
          await Swal.fire({
            title: 'Ha habido un error al obtener las documentaciones del siniestro. Inténtelo de nuevo',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }        
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
      let respuesta: boolean;

      try {
        respuesta = await this.mensajesService.eliminar(idMensaje).toPromise();
      } catch (error) {
        await Swal.fire({
          title: 'Ha habido un error al eliminar el mensaje. Inténtelo de nuevo',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
  
        return;
      }      

      if (respuesta) {
        await Swal.fire({
          title: 'Mensaje eliminado',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar'
        });

        try {
          this.mensajes = await this.mensajesService.obtenerTodosPorIdSiniestro(this.siniestro.id).toPromise();
        } catch (error) {
          await Swal.fire({
            title: 'Ha habido un error al obtener los mensajes del siniestro. Inténtelo de nuevo',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
    
          return;
        }        
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
      let respuesta: boolean;

      try {
        respuesta = await this.imagenesService.eliminar(idImagen).toPromise();
      } catch (error) {
        await Swal.fire({
          title: 'Ha habido un error al eliminar la imagen. Inténtelo de nuevo',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
  
        return;
      }      

      if (respuesta) {
        await Swal.fire({
          title: 'Imagen eliminada',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar'
        });

        try {
          this.imagenes = await this.imagenesService.obtenerPorIdSiniestro(this.siniestro.id).toPromise(); 
        } catch (error) {
          Swal.fire({
            title: 'Ha habido un error al obtener las imágenes. Inténtelo de nuevo',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }        
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
