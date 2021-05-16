import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Documentacion } from 'src/app/interfaces/documentacion';
import { Imagen } from 'src/app/interfaces/imagen';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { DocumentacionesService } from 'src/app/servicios/documentaciones.service';
import { ImagenesService } from 'src/app/servicios/imagenes.service';
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

  constructor(private route: ActivatedRoute, private siniestrosService: SiniestrosService, private documentacionesService: DocumentacionesService,
              private router: Router, private imagenesService: ImagenesService) { }

  async ngOnInit(): Promise<void> {
    let idSiniestro: number = Number(this.route.snapshot.paramMap.get('id'));
    this.siniestro = await this.siniestrosService.obtenerPorId(idSiniestro).toPromise();
    this.documentaciones = await this.documentacionesService.obtenerPorIdSiniestro(idSiniestro).toPromise();
    this.imagenes = await this.imagenesService.obtenerPorIdSiniestro(idSiniestro).toPromise();
  }

  async verArchivo(id: number): Promise<void> {
    let pdf: Blob = await this.documentacionesService.obtener(id).toPromise();
    
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

  public subirImagen(idSiniestro: number): void {
    this.router.navigate(['/subirImagen', idSiniestro]);
  }
}
