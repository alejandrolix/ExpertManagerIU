import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagenesService } from 'src/app/servicios/imagenes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subir-imagen',
  templateUrl: './subir-imagen.component.html',
  styleUrls: ['./subir-imagen.component.scss']
})
export class SubirImagenComponent implements OnInit {
  public formSubirImagen: FormGroup;
  public hayImagenSeleccionada: boolean;
  @ViewChild("imagen") imagen: ElementRef;
  private idSiniestro: number;

  constructor(private route: ActivatedRoute, private imagenesService: ImagenesService, private router: Router) { }

  ngOnInit(): void {
    this.idSiniestro = Number(this.route.snapshot.paramMap.get('id'));
    this.formSubirImagen = new FormGroup({
      descripcion: new FormControl('', Validators.required)
    });

    this.hayImagenSeleccionada = true;
  }

  public irAtras(): void {
    history.back();
  }

  public async enviar(): Promise<void> {
    let nombreImagenSeleccionada: string = this.imagen.nativeElement.value;
    
    if (nombreImagenSeleccionada === '')
      this.hayImagenSeleccionada = false;
    else
      this.hayImagenSeleccionada = true;

    if (this.formSubirImagen.valid && this.hayImagenSeleccionada) {
      let imagen: any = this.imagen.nativeElement.files[0];

      let envioImagen = {
        descripcion: this.formSubirImagen.get('descripcion')?.value,
        idSiniestro: this.idSiniestro,
        imagen: imagen
      };

      let respuesta: boolean = await this.imagenesService.subirImagen(envioImagen).toPromise();

      if (respuesta) {
        let accion = await Swal.fire({
          title: 'Imagen subida correctamente',
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
          title: 'Ha habido un error al subir la imagen',
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

  public async comprobarImagen(): Promise<void> {
    let nombreImagen: string = this.imagen.nativeElement.files[0].name;
    let partesNombreImagen: string[] = nombreImagen.split('.');
    let extensionImagen: string = partesNombreImagen[partesNombreImagen.length - 1];
    let extensionesPermitidas: string[] = ['jpeg', 'jpg', 'png'];

    if (!extensionesPermitidas.includes(extensionImagen)) {
      await Swal.fire({
        title: 'La imagen seleccionada tiene que ser en formato jpeg, jpg o png',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      
      this.imagen.nativeElement.value = "";
    }      
    else
      this.hayImagenSeleccionada = true;
  }
}
