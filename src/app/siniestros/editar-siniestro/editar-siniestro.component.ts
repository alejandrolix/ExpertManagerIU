import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Aseguradora } from 'src/app/interfaces/aseguradora';
import { Danio } from 'src/app/interfaces/danio';
import { Estado } from 'src/app/interfaces/estado';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { Usuario } from 'src/app/interfaces/usuario';
import { AseguradorasService } from 'src/app/servicios/aseguradoras.service';
import { DaniosService } from 'src/app/servicios/danios.service';
import { EstadosService } from 'src/app/servicios/estados.service';
import { PeritosService } from 'src/app/servicios/peritos.service';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-editar-siniestro',
  templateUrl: './editar-siniestro.component.html',
  styleUrls: ['./editar-siniestro.component.scss']
})
export class EditarSiniestroComponent implements OnInit {
  public estados: Estado[];
  public aseguradoras: Aseguradora[];
  public danios: Danio[];
  public peritos: Usuario[];
  public formEditarSiniestro: FormGroup;
  public siniestro: Siniestro;
  public mostrarImpValoracionDanios: boolean;

  constructor(private aseguradorasService: AseguradorasService, private daniosService: DaniosService, private peritosService: PeritosService, private siniestrosService: SiniestrosService,
              private router: Router, private estadosService: EstadosService, private route: ActivatedRoute) {

    this.aseguradoras = [];
    this.danios = [];
    this.peritos = [];
    this.mostrarImpValoracionDanios = false;
  }

  async ngOnInit(): Promise<void> {
    let idSiniestro: number = Number(this.route.snapshot.paramMap.get('id'));    
    this.siniestro = await this.siniestrosService.obtenerPorId(idSiniestro).toPromise();          

    this.estados = await this.estadosService.obtenerTodos().toPromise();
    this.aseguradoras = await this.aseguradorasService.obtenerTodas().toPromise();
    this.danios = await this.daniosService.obtenerTodos().toPromise();
    this.peritos = await this.peritosService.obtenerTodos().toPromise();  
    
    let idEstadoSeleccionado = this.estados.find(e => e.id == this.siniestro.idEstado)?.id;

    if (idEstadoSeleccionado == undefined)
      return;

    let idAseguradoraSeleccionada = this.aseguradoras.find(a => a.id == this.siniestro.idAseguradora)?.id;

    if (idAseguradoraSeleccionada == undefined)
      return;

    let idDanioSeleccionado = this.danios.find(d => d.id == this.siniestro.idDanio)?.id;

    if (idDanioSeleccionado == undefined)
      return;

    let idSujetoAfecSeleccionado: number = this.siniestro.idSujetoAfectado;

    let idPeritoSeleccionado = this.peritos.find(p => p.id == this.siniestro.idPerito)?.id;

    if (idPeritoSeleccionado == undefined)
      return;    

    this.formEditarSiniestro = new FormGroup({
      estado: new FormControl(idEstadoSeleccionado),
      aseguradora: new FormControl(idAseguradoraSeleccionada),
      direccion: new FormControl(this.siniestro.direccion, Validators.required),
      descripcion: new FormControl(this.siniestro.descripcion, Validators.required),
      danio: new FormControl(idDanioSeleccionado),
      sujetoAfectado: new FormControl(idSujetoAfecSeleccionado),
      perito: new FormControl(idPeritoSeleccionado)
    });    

    if (idEstadoSeleccionado == 3) {    // Estado Valorado
      this.mostrarImpValoracionDanios = true;
      let impValoracionDanios: string = this.siniestro.impValoracionDanios.replace('€', '').trim();

      this.formEditarSiniestro.addControl('impValoracionDanios', new FormControl(impValoracionDanios, Validators.required));
    }      
  }

  public comprobarIdEstado(e: any): void {
    let idEstado = parseInt(e.target.value);

    if (idEstado == 3)
      this.mostrarImpValoracionDanios = true;
    else
      this.mostrarImpValoracionDanios = false;
  }

  public async enviar(): Promise<void> {
    if (!this.formEditarSiniestro.valid)
      return;

    let idEstado: number = parseInt(this.formEditarSiniestro.get('estado')?.value);
    let idAseguradora: number = parseInt(this.formEditarSiniestro.get('aseguradora')?.value);
    let direccion: string = this.formEditarSiniestro.get('direccion')?.value;
    let descripcion: string = this.formEditarSiniestro.get('descripcion')?.value;
    let idDanio: number = parseInt(this.formEditarSiniestro.get('danio')?.value);
    let idSujetoAfectado: number = parseInt(this.formEditarSiniestro.get('sujetoAfectado')?.value);
    let idPerito: number = parseInt(this.formEditarSiniestro.get('perito')?.value);

    let siniestro = {
      idUsuarioAlta: 1,
      idEstado: idEstado,
      idAseguradora: idAseguradora,
      direccion: direccion,
      descripcion: descripcion,
      idDanio: idDanio,
      idSujetoAfectado: idSujetoAfectado,
      idPerito: idPerito
    };    

    let respuesta: boolean = await this.siniestrosService.editar(siniestro, this.siniestro.id).toPromise();

    if (respuesta) {
      let accion: SweetAlertResult = await Swal.fire({
        title: 'Siniestro editado correctamente',
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
        this.router.navigateByUrl('/siniestros');
    }     
    else
      Swal.fire({
        title: 'Ha habido un error al editar el siniestro',
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
