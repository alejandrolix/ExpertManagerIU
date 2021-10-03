import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, pluck } from 'rxjs/operators';
import { Alerta } from 'src/app/clases/Alerta';
import { TipoArchivo } from 'src/app/enumeraciones/tipo-archivo.enum';
import { DocumentacionesService } from 'src/app/servicios/documentaciones.service';
import { ImagenesService } from 'src/app/servicios/imagenes.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';

@Component({
  selector: 'app-subir-archivo',
  templateUrl: './subir-archivo.component.html',
  styleUrls: ['./subir-archivo.component.scss']
})
export class SubirArchivoComponent implements OnInit {
  public formSubirArchivo: FormGroup;
  public hayArchivoSeleccionado: boolean;
  @ViewChild("archivo") archivo: ElementRef<HTMLInputElement>;
  private idSiniestro: number;  
  public formatosArchivoASubir: string;
  public tipoArchivoEnum: typeof TipoArchivo = TipoArchivo;
  public tipoArchivo: TipoArchivo;  

  constructor(private route: ActivatedRoute, private spinnerService: SpinnerService, private documentacionesService: DocumentacionesService, private imagenesService: ImagenesService,
              private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.spinnerService.mostrarSpinner();
    this.idSiniestro = Number(this.route.snapshot
                                        .paramMap
                                        .get('id'));

    if (isNaN(this.idSiniestro)) {
      Alerta.mostrarError('El id del siniestro es incorrecto');
      this.irAtras();
    }

    this.tipoArchivo = Number(await this.route.queryParamMap
                                              .pipe(
                                                first(),
                                                pluck('params'),
                                                pluck('tipoArchivo')
                                              )
                                              .toPromise());
    if (isNaN(this.tipoArchivo)) {
      Alerta.mostrarError('El tipo de archivo es incorrecto');
      this.irAtras();
    }    

    if (this.tipoArchivo === TipoArchivo.Documento)        
      this.formatosArchivoASubir = "application/pdf";    
    else      
      this.formatosArchivoASubir = "image/png, image/jpeg, image/jpg";    

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
    if (!this.formSubirArchivo.valid)
      return;

    let descripcion: string = this.formSubirArchivo.get('descripcion')?.value;

    if (descripcion == undefined) {
      Alerta.mostrarError('La descripción está vacía');
      return;
    }

    let nombreArchivoSeleccionado: string = this.archivo.nativeElement.value;

    if (nombreArchivoSeleccionado.length === 0) {
      this.hayArchivoSeleccionado = false;
      return;
    }    

    let archivo: any = this.archivo.nativeElement.files?.[0];
    let archivoASubir = {
      descripcion,
      idSiniestro: this.idSiniestro,
      archivo
    };
    let respuesta: boolean = true;      

    if (this.tipoArchivo === TipoArchivo.Documento)
      try {
        respuesta = await this.documentacionesService.subirDocumentacion(archivoASubir)
                                                      .toPromise();
      } catch (error: any) {
        Alerta.mostrarError(error);

        return;
      }
    else
      try {
        respuesta = await this.imagenesService.subirImagen(archivoASubir)
                                              .toPromise();
      } catch (error: any) {
        Alerta.mostrarError(error);

        return;
      }

    if (respuesta) {
      await Alerta.mostrarOkAsincrono('Archivo subido correctamente');        
      this.router.navigate(['/siniestros/detalles', this.idSiniestro]);
    }    
  }

  public async comprobarArchivo(): Promise<void> {    
    if (!this.archivo.nativeElement.files) {
      await Alerta.mostrarErrorAsincrono('Seleccione un archivo');
      return;
    }

    let formatosArchivos: string[] = ['pdf', 'jpg', 'jpeg', 'png'];
    let nombreArchivo: string | undefined = this.archivo.nativeElement.files[0].name;
    let partesNombreArchivo: string[] | undefined = nombreArchivo?.split('.');
    let extensionArchivo: string | undefined = partesNombreArchivo?.[partesNombreArchivo.length - 1];

    if (extensionArchivo == undefined) {
      await Alerta.mostrarErrorAsincrono('La extensión del archivo no es correcta');
      return;
    }

    if (!formatosArchivos.includes(extensionArchivo)) {
      await Alerta.mostrarErrorAsincrono(`El archivo seleccionado tiene que ser ${formatosArchivos.join(', ')}`);      
    }
    else
      this.hayArchivoSeleccionado = true;
  }
}
