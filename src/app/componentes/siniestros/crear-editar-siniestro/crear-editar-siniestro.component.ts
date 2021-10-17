import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, pluck } from 'rxjs/operators';
import { Alerta } from 'src/app/clases/Alerta';
import { CrearSiniestroDto } from 'src/app/clases/DTOs/crear-siniestro-dto';
import { EditarSiniestroDto } from 'src/app/clases/DTOs/editar-siniestro-dto';
import { AccionFormulario } from 'src/app/enumeraciones/accion-formulario.enum';
import { TipoEstado } from 'src/app/enumeraciones/tipo-estado.enum';
import { Aseguradora } from 'src/app/interfaces/aseguradora';
import { Danio } from 'src/app/interfaces/danio';
import { Estado } from 'src/app/interfaces/estado';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { Usuario } from 'src/app/interfaces/usuario';
import { AseguradorasService } from 'src/app/servicios/aseguradoras.service';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { DaniosService } from 'src/app/servicios/danios.service';
import { EstadosService } from 'src/app/servicios/estados.service';
import { PeritosService } from 'src/app/servicios/peritos.service';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';

@Component({
  selector: 'app-crear-editar-siniestro',
  templateUrl: './crear-editar-siniestro.component.html',
  styleUrls: ['./crear-editar-siniestro.component.scss']
})
export class CrearEditarSiniestroComponent implements OnInit {
  public accionFormularioEnum: typeof AccionFormulario = AccionFormulario;
  public accionFormulario: AccionFormulario; 
  public estados: Estado[];
  public aseguradoras: Aseguradora[];
  public danios: Danio[];
  public peritos: Usuario[];
  public formCrearEditarSiniestro: FormGroup;  
  public mostrarCampoImpValDanios: boolean;
  private impValoracionDanios: string;
  private idSiniestro: number;

  constructor(private route: ActivatedRoute, private siniestrosService: SiniestrosService, private location: Location, private spinnerService: SpinnerService, private estadosService: EstadosService,
              private aseguradorasService: AseguradorasService, private daniosService: DaniosService, private peritosService: PeritosService, private autenticacionService: AutenticacionService,
              private router: Router) { }

  async ngOnInit(): Promise<void> {    
    this.spinnerService.mostrarSpinner();
    this.accionFormulario = Number(await this.route.queryParamMap
                                                   .pipe(
                                                     first(),
                                                     pluck('params'),
                                                     pluck('tipoAccion')
                                                   )
                                                   .toPromise());
    if (isNaN(this.accionFormulario)) {
      Alerta.mostrarError('El tipo de acción es incorrecto');
      this.irAtras();
    }

    try {
      this.estados = await this.estadosService.obtenerTodos()
                                              .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();
      return;
    }          

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

    if (this.accionFormulario == AccionFormulario.Editar) {
      this.spinnerService.mostrarSpinner();

      let idSiniestro: number = Number(this.route.snapshot
                                                 .paramMap
                                                 .get('id'));
      if (isNaN(idSiniestro)) {
        Alerta.mostrarError('El id del siniestro es incorrecto');
        this.irAtras();
      }

      this.idSiniestro = idSiniestro;
      let siniestro: Siniestro;

      try {
        siniestro = await this.siniestrosService.obtenerPorId(idSiniestro)
                                                .toPromise();
      } catch (error: any) {
        Alerta.mostrarError(error);
        this.spinnerService.ocultarSpinner();
        return;
      }

      let idEstadoSeleccionado: number | undefined = this.estados.find(estado => estado.id === siniestro.idEstado)?.id;

      if (idEstadoSeleccionado == undefined) {
        Alerta.mostrarError('No se ha encontrado el estado del siniestro');
        this.spinnerService.ocultarSpinner();
        return;
      }

      let idAseguradoraSeleccionada: number | undefined = this.aseguradoras.find(aseguradora => aseguradora.id === siniestro.idAseguradora)?.id;

      if (idAseguradoraSeleccionada == undefined) {
        Alerta.mostrarError('No se ha encontrado la aseguradora del siniestro'); 
        this.spinnerService.ocultarSpinner();       
        return;
      }

      let idDanioSeleccionado: number | undefined = this.danios.find(danio => danio.id === siniestro.idDanio)?.id;

      if (idDanioSeleccionado == undefined) {
        Alerta.mostrarError('No se ha encontrado el daño del siniestro');
        this.spinnerService.ocultarSpinner();
        return;
      }        

      let idSujetoAfecSeleccionado: number = siniestro.idSujetoAfectado;
      let idPeritoSeleccionado: number | undefined = this.peritos.find(perito => perito.id === siniestro.idPerito)?.id;

      if (idPeritoSeleccionado == undefined) {
        Alerta.mostrarError('No se ha encontrado el perito del siniestro');
        this.spinnerService.ocultarSpinner();
        return;
      }
      
      this.formCrearEditarSiniestro = new FormGroup({
        estado: new FormControl(idEstadoSeleccionado),
        aseguradora: new FormControl(idAseguradoraSeleccionada),
        direccion: new FormControl(siniestro.direccion, Validators.required),
        descripcion: new FormControl(siniestro.descripcion, Validators.required),
        danio: new FormControl(idDanioSeleccionado),
        sujetoAfectado: new FormControl(idSujetoAfecSeleccionado),
        perito: new FormControl(idPeritoSeleccionado)
      });

      if (idEstadoSeleccionado == TipoEstado.Valorado) {
        this.mostrarCampoImpValDanios = true;
        this.impValoracionDanios = siniestro.impValoracionDanios
                                            .replace('€', '')
                                            .trim();

        this.crearControlImpValoracionDanios();
      }      
    }
    else {
      this.formCrearEditarSiniestro = new FormGroup({
        aseguradora: new FormControl(this.aseguradoras[0].id),
        direccion: new FormControl('', Validators.required),
        descripcion: new FormControl('', Validators.required),
        danio: new FormControl(this.danios[0].id),
        sujetoAfectado: new FormControl(0),
        perito: new FormControl(this.peritos[0].id)
      });
    }

    this.spinnerService.ocultarSpinner();
  }

  public irAtras(): void {
    this.location.back();
  }

  private crearControlImpValoracionDanios(): void {
    let control: FormControl = new FormControl(this.impValoracionDanios, Validators.required);

    this.formCrearEditarSiniestro.addControl('impValoracionDanios', control);
  }
  
  public async enviar(): Promise<void> {
    if (!this.formCrearEditarSiniestro.valid)
      return;

      this.spinnerService.mostrarSpinner();
      
      let idUsuarioAlta: number = this.autenticacionService.obtenerIdUsuario();
      let idAseguradora: number = parseInt(this.formCrearEditarSiniestro.get('aseguradora')?.value);
      let direccion: string = this.formCrearEditarSiniestro.get('direccion')?.value;
      let descripcion: string = this.formCrearEditarSiniestro.get('descripcion')?.value;
      let idDanio: number = parseInt(this.formCrearEditarSiniestro.get('danio')?.value);
      let idSujetoAfectado: number = parseInt(this.formCrearEditarSiniestro.get('sujetoAfectado')?.value);
      let idPerito: number = parseInt(this.formCrearEditarSiniestro.get('perito')?.value);

      if (this.accionFormulario == AccionFormulario.Editar) {
        let idEstado: number = parseInt(this.formCrearEditarSiniestro.get('estado')?.value);
        let impValoracionDanios: string = "";

        if (idEstado == TipoEstado.Valorado)
          impValoracionDanios = this.formCrearEditarSiniestro.get('impValoracionDanios')?.value;

        let siniestro: EditarSiniestroDto = {
          idUsuarioAlta,
          idAseguradora,
          direccion,
          descripcion,
          idDanio,
          idSujetoAfectado,
          idPerito,
          idEstado,
          impValoracionDanios        
        };

        try {
          await this.siniestrosService.editar(siniestro, this.idSiniestro)
                                      .toPromise();
        } catch (error: any) {
          debugger
          Alerta.mostrarError(error);
          this.spinnerService.ocultarSpinner();
  
          return;
        }

        await Alerta.mostrarOkAsincrono('Siniestro editado correctamente');
      }
      else {
        let siniestro: CrearSiniestroDto = {
          idUsuarioAlta,
          idAseguradora,
          direccion,
          descripcion,
          idDanio,
          idSujetoAfectado,
          idPerito,          
        };

        try {
          await this.siniestrosService.crear(siniestro)
                                      .toPromise();
        } catch (error: any) {
          Alerta.mostrarError(error);
          this.spinnerService.ocultarSpinner();
    
          return;
        }

        await Alerta.mostrarOkAsincrono('Siniestro creado correctamente');
      }                        
  
      this.spinnerService.ocultarSpinner();
      this.router.navigateByUrl('/siniestros');
  }

  public comprobarEstadoSeleccionado(e: any): void {    
    let idEstado: number = parseInt(e.value);

    if (idEstado == TipoEstado.Valorado) {
      this.crearControlImpValoracionDanios();
      this.mostrarCampoImpValDanios = true;
    }      
    else {
      this.formCrearEditarSiniestro.removeControl('impValoracionDanios');
      this.mostrarCampoImpValDanios = false;
    }
  }
}
