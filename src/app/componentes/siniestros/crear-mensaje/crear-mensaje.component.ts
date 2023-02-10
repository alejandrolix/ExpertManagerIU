import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Alerta } from 'src/app/clases/Alerta';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { MensajesService } from 'src/app/servicios/mensajes.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';

@Component({
  selector: 'app-crear-mensaje',
  templateUrl: './crear-mensaje.component.html',
  styleUrls: ['./crear-mensaje.component.scss']
})
export class CrearMensajeComponent implements OnInit {
  public formCrearMensaje: FormGroup;
  private idSiniestro: number;

  constructor(private route: ActivatedRoute, private autenticacionService: AutenticacionService, private mensajesService: MensajesService,
              private router: Router, private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.spinnerService.ocultarSpinner();
    this.idSiniestro = Number(this.route.snapshot.paramMap.get('id'));

    this.formCrearMensaje = new FormGroup({
      descripcion: new FormControl('', Validators.required)
    });
  }

  public async crear(): Promise<void> {
    if (!this.formCrearMensaje.valid)
      return;

    let descripcion: string = this.formCrearMensaje.get('descripcion')?.value;
    let idUsuarioCreado: number = this.autenticacionService.obtenerIdUsuario();

    let mensaje: { descripcion: string, idUsuarioCreado: number, idSiniestro: number } = {
      descripcion,
      idUsuarioCreado,
      idSiniestro: this.idSiniestro
    };

    this.spinnerService.mostrarSpinner();
    let respuesta: boolean;

    try {
      respuesta = await firstValueFrom(this.mensajesService.crear(mensaje));
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();

      return;
    }

    if (respuesta) {
      await Alerta.mostrarOkAsincrono('Mensaje creado correctamente');
      this.router.navigateByUrl(`/siniestros/detalles/${this.idSiniestro}`);
    }
  }
}
