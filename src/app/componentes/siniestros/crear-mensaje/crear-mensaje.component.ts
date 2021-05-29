import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MensajesService } from 'src/app/servicios/mensajes.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-mensaje',
  templateUrl: './crear-mensaje.component.html',
  styleUrls: ['./crear-mensaje.component.scss']
})
export class CrearMensajeComponent implements OnInit {
  public formCrearMensaje: FormGroup;
  private idSiniestro: number;

  constructor(private route: ActivatedRoute, private usuariosService: UsuariosService, private mensajesService: MensajesService,
              private router: Router) { }

  ngOnInit(): void {
    this.idSiniestro = Number(this.route.snapshot.paramMap.get('id'));

    this.formCrearMensaje = new FormGroup({
      descripcion: new FormControl('', Validators.required)
    });
  }

  public async crear(): Promise<void> {
    if (!this.formCrearMensaje.valid)
      return;

    let descripcion: string = this.formCrearMensaje.get('descripcion')?.value;
    let idUsuarioCreado: number = this.usuariosService.obtenerIdUsuarioLogueado();
    let idSiniestro: number = this.idSiniestro;

    let mensaje = {
      descripcion: descripcion,
      idUsuarioCreado: idUsuarioCreado,
      idSiniestro: idSiniestro
    };

    let respuesta: boolean;

    try {
      respuesta = await this.mensajesService.crear(mensaje).toPromise(); 
    } catch (error) {
      Swal.fire({
        title: 'Ha habido un error al crear el mensaje. Inténtelo de nuevo',
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
      let accion = await Swal.fire({
        title: 'Mensaje creado correctamente',
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
        title: 'Ha habido un error al crear el mensaje',
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
