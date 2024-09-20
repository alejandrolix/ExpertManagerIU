import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
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
  private idSiniestro: number;
  public formatosArchivoSeleccionar: string;
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

    const claveTipoAccion: string = 'tipoArchivo';

    this.tipoArchivo = Number(await firstValueFrom(this.route.queryParamMap
                                              .pipe(
                                                map((paramMap: ParamMap) => {
                                                  if (paramMap.get(claveTipoAccion) !== null) {
                                                    return paramMap.get(claveTipoAccion);
                                                  }

                                                  return 0;
                                                })
                                              )));

    if (isNaN(this.tipoArchivo) || !(this.tipoArchivo in TipoArchivo)) {
      Alerta.mostrarError('El tipo de archivo es incorrecto');
      this.irAtras();
    }

    if (this.tipoArchivo === TipoArchivo.Documento) {
      this.formatosArchivoSeleccionar = "application/pdf";
    }
    else {
      this.formatosArchivoSeleccionar = "image/png, image/jpeg, image/jpg";
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

  public async enviar(archivo: File): Promise<void> {
    this.hayArchivoSeleccionado = true;
    
    if (!this.formSubirArchivo.valid) {
      return;
    }

    let esCorrecto: boolean = this.esValidoFormulario(archivo);

    if (!esCorrecto) {
      return;
    }

    let datosParaSubir = {
      descripcion: this.formSubirArchivo.get('descripcion')?.value,
      idSiniestro: this.idSiniestro,
      archivo
    };
    let respuesta: boolean = true;

    if (this.tipoArchivo === TipoArchivo.Documento) {
      respuesta = await firstValueFrom(this.documentacionesService.subirDocumentacion(datosParaSubir));
    }
    else {
      respuesta = await firstValueFrom(this.imagenesService.subirImagen(datosParaSubir));
    }

    if (respuesta) {
      let mensaje: string = '';

      if (this.tipoArchivo === TipoArchivo.Documento) {
        mensaje = 'Documento subido correctamente';
      }
      else {
        mensaje = 'Imagen subida correctamente';
      }

      await Alerta.mostrarOkAsincrono(mensaje);
      this.router.navigate(['siniestros', this.idSiniestro, 'detalles']);
    }
  }

  private esValidoFormulario(archivo: File): boolean {
    if (!archivo) {
      this.hayArchivoSeleccionado = false;
      return false;
    }

    let extensionDocAdmitido = 'pdf';
    let extensionesImagenAdmitidos: string[] = ['jpg', 'jpeg', 'png'];
    let tamanioMaxArchivoBytes: number = 5000000;

    if (!this.formSubirArchivo.get('descripcion')?.value) {
      Alerta.mostrarError('La descripción está vacía');
      return false;
    }

    if (archivo.size!! > tamanioMaxArchivoBytes) {
      Alerta.mostrarErrorAsincrono('El archivo supera 5 megabytes');
      return false;
    }

    let extensionArchivo: string = archivo.type.split('/')[1]!!;

    if (this.tipoArchivo === TipoArchivo.Documento) {
      if (extensionArchivo !== extensionDocAdmitido) {
        Alerta.mostrarErrorAsincrono(`El archivo debe tener extensión ${extensionDocAdmitido}`);
        return false;
      }
    }
    else {
      if (!extensionesImagenAdmitidos.includes(extensionArchivo)) {
        Alerta.mostrarErrorAsincrono(`El archivo debe tener extensión ${extensionesImagenAdmitidos.join(', ')}`);
        return false;
      }
    }

    return true;
  }
}
