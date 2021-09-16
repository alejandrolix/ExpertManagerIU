import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Alerta } from 'src/app/clases/Alerta';
import { MensajesService } from 'src/app/servicios/mensajes.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { SweetAlertResult } from 'sweetalert2';

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
      respuesta = await this.mensajesService.crear(mensaje)
                                            .toPromise(); 
    } catch (error: any) {
      Alerta.mostrarError(error);

      return;
    }    

    if (respuesta) {
      let accion: SweetAlertResult = await Alerta.mostrarOkAsincrono('Mensaje creado correctamente');      

      if (accion.isConfirmed)        
        this.router.navigateByUrl(`/siniestros/detalles/${this.idSiniestro}`);
    }         
  }
}
