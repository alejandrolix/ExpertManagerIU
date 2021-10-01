import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first, pluck } from 'rxjs/operators';
import { Alerta } from 'src/app/clases/Alerta';
import { TipoArchivo } from 'src/app/enumeraciones/tipo-archivo.enum';
import { SpinnerService } from 'src/app/servicios/spinner.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subir-archivo',
  templateUrl: './subir-archivo.component.html',
  styleUrls: ['./subir-archivo.component.scss']
})
export class SubirArchivoComponent implements OnInit {
  public formSubirArchivo: FormGroup;
  public hayArchivoSeleccionado: boolean;
  @ViewChild("archivo") archivo: ElementRef;
  private idSiniestro: number;
  public esImagen: boolean;
  public formatosArchivoASubir: string;

  constructor(private route: ActivatedRoute, private spinnerService: SpinnerService) { }

  async ngOnInit(): Promise<void> {
    this.spinnerService.mostrarSpinner();
    this.idSiniestro = Number(this.route.snapshot
                                        .paramMap
                                        .get('id'));

    if (isNaN(this.idSiniestro)) {
      Alerta.mostrarError('El id del siniestro es incorrecto');
      this.irAtras();
    }

    let tipoArchivo: TipoArchivo = Number(await this.route.queryParamMap
                                                          .pipe(
                                                            first(),
                                                            pluck('params'),
                                                            pluck('tipoArchivo')
                                                          )
                                                          .toPromise());
    if (isNaN(tipoArchivo)) {
      Alerta.mostrarError('El tipo de archivo es incorrecto');
      this.irAtras();
    }    

    if (tipoArchivo === TipoArchivo.Documento) {
      this.esImagen = false;    
      this.formatosArchivoASubir = "application/pdf";
    }
    else {
      this.esImagen = true;
      this.formatosArchivoASubir = "image/png, image/jpeg, image/jpg";
    }

    this.formSubirArchivo = new FormGroup({
      descripcion: new FormControl('', Validators.required)
    });

    this.hayArchivoSeleccionado = true;      
    this.spinnerService.ocultarSpinner();
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

    if (this.formSubirArchivo.valid && this.hayArchivoSeleccionado) {
      let archivo: any = this.archivo.nativeElement.files[0];

      let documentacion = {
        descripcion: this.formSubirArchivo.get('descripcion')?.value,
        idSiniestro: this.idSiniestro,
        archivo: archivo
      };

      let respuesta: boolean = true;

      // try {
      //   respuesta = await this.documentacionesService.subirDocumentacion(documentacion).toPromise();
      // } catch (error) {
      //   await Swal.fire({
      //     title: 'Ha habido un error al crear la documentación. Inténtelo de nuevo',
      //     icon: 'error',          
      //     confirmButtonColor: '#3085d6',          
      //     confirmButtonText: 'Aceptar',          
      //   });

      //   return;
      // }      

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

        // if (accion.isConfirmed)
        //   this.router.navigate(['/detallesSiniestro', this.idSiniestro]);
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

  public async comprobarArchivo(): Promise<void> {
    let nombreArchivo: string = this.archivo.nativeElement.files[0].name;
    let partesNombreArchivo: string[] = nombreArchivo.split('.');
    let extensionArchivo: string = partesNombreArchivo[partesNombreArchivo.length - 1];

    if (extensionArchivo !== 'pdf') {
      await Swal.fire({
        title: 'El archivo seleccionado tiene que ser pdf',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });

      this.archivo.nativeElement.value = "";
    }
    else
      this.hayArchivoSeleccionado = true;
  }
}
