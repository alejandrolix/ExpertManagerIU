import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Alerta } from 'src/app/clases/Alerta';
import { Aseguradora } from 'src/app/interfaces/aseguradora';
import { Danio } from 'src/app/interfaces/danio';
import { Usuario } from 'src/app/interfaces/usuario';
import { AseguradorasService } from 'src/app/servicios/aseguradoras.service';
import { DaniosService } from 'src/app/servicios/danios.service';
import { PeritosService } from 'src/app/servicios/peritos.service';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-crear-siniestro',
  templateUrl: './crear-siniestro.component.html',
  styleUrls: ['./crear-siniestro.component.scss']
})
export class CrearSiniestroComponent implements OnInit {
  public aseguradoras: Aseguradora[];
  public danios: Danio[];
  public peritos: Usuario[];
  public formCrearSiniestro: FormGroup;

  constructor(private aseguradorasService: AseguradorasService, private daniosService: DaniosService, private peritosService: PeritosService, private siniestrosService: SiniestrosService,
              private router: Router, private usuariosService: UsuariosService, private spinnerService: SpinnerService) {
                
    this.aseguradoras = [];
    this.danios = [];
    this.peritos = [];
    this.spinnerService.mostrarSpinner();
  }

  async ngOnInit(): Promise<void> {
    try {
      this.aseguradoras = await this.aseguradorasService.obtenerTodas()
                                                        .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();

      return;
    }

    try {
      this.danios = await this.daniosService.obtenerTodos()
                                            .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();

      return;
    }
    
    try {
      this.peritos = await this.peritosService.obtenerTodos()
                                              .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);

      this.spinnerService.ocultarSpinner();
      return;
    }    

    this.formCrearSiniestro = new FormGroup({
      aseguradora: new FormControl(this.aseguradoras[0].id),
      direccion: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
      danio: new FormControl(this.danios[0].id),
      sujetoAfectado: new FormControl(0),
      perito: new FormControl(this.peritos[0].id)
    });

    this.spinnerService.ocultarSpinner();
  }

  public mostrarSpinner(): boolean {
    return this.spinnerService.mostrar;
  }

  public async enviar(): Promise<void> {
    if (!this.formCrearSiniestro.valid)
      return;

    let idUsuarioAlta: number = this.usuariosService.obtenerIdUsuarioLogueado();
    let idAseguradora: number = parseInt(this.formCrearSiniestro.get('aseguradora')?.value);
    let direccion: string = this.formCrearSiniestro.get('direccion')?.value;
    let descripcion: string = this.formCrearSiniestro.get('descripcion')?.value;
    let idDanio: number = parseInt(this.formCrearSiniestro.get('danio')?.value);
    let idSujetoAfectado: number = parseInt(this.formCrearSiniestro.get('sujetoAfectado')?.value);
    let idPerito: number = parseInt(this.formCrearSiniestro.get('perito')?.value);

    let siniestro = {
      idUsuarioAlta: idUsuarioAlta,
      idAseguradora: idAseguradora,
      direccion: direccion,
      descripcion: descripcion,
      idDanio: idDanio,
      idSujetoAfectado: idSujetoAfectado,
      idPerito: idPerito
    };

    let respuesta: boolean;

    try {
      respuesta = await this.siniestrosService.crear(siniestro)
                                              .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);

      return;
    }    

    if (respuesta) {
      let accion: SweetAlertResult = await Alerta.mostrarPreguntaAsincrono('Siniestro creado correctamente');

      if (accion.isConfirmed)
        this.router.navigateByUrl('/siniestros');
    }     
    else
      Alerta.mostrarError('Ha habido un error al crear el siniestro');
  }
}
