import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DocumentacionesService } from 'src/app/servicios/documentaciones.service';

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

  constructor(private route: ActivatedRoute, private documentacionesService: DocumentacionesService) { }

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
    }
  }

  public comprobarArchivo(): void {
    this.hayArchivoSeleccionado = true;
  }
}
