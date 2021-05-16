import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentacionesService } from 'src/app/servicios/documentaciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subir-documentacion',
  templateUrl: './subir-documentacion.component.html',
  styleUrls: ['./subir-documentacion.component.scss']
})
export class SubirDocumentacionComponent implements OnInit {
  public formSubirDocumentacion: FormGroup;
  public hayArchivoSeleccionado: boolean;
  @ViewChild("archivo") archivo: ElementRef;
  private idSiniestro: number;

  constructor(private route: ActivatedRoute, private documentacionesService: DocumentacionesService, private router: Router) { }

  ngOnInit(): void {
    this.idSiniestro = Number(this.route.snapshot.paramMap.get('id'));
    this.formSubirDocumentacion = new FormGroup({
      descripcion: new FormControl('', Validators.required)
    });

    this.hayArchivoSeleccionado = true;
  }

  public irAtras(): void {
    history.back();
  }

  public async enviar(): Promise<void> {
    let nombreArchivoSeleccionado: string = this.archivo.nativeElement.value;
    
    if (nombreArchivoSeleccionado === '')
      this.hayArchivoSeleccionado = false;
    else
      this.hayArchivoSeleccionado = true;

    if (this.formSubirDocumentacion.valid && this.hayArchivoSeleccionado) {
      let archivo: any = this.archivo.nativeElement.files[0];

      let documentacion = {
        descripcion: this.formSubirDocumentacion.get('descripcion')?.value,
        idSiniestro: this.idSiniestro,
        archivo: archivo
      };

      let respuesta: boolean = await this.documentacionesService.subirDocumentacion(documentacion).toPromise();

      if (respuesta) {
        let accion = await Swal.fire({
          title: 'Archivo subido correctamente',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });        
  
        if (accion.isConfirmed)
          this.router.navigate(['/detallesSiniestro', this.idSiniestro]);
      }     
      else
        Swal.fire({
          title: 'Ha habido un error al subir el archivo',
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

  public comprobarArchivo(): void {
    this.hayArchivoSeleccionado = true;
  }
}
