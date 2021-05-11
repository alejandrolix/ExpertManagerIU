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

  constructor(private aseguradorasService: AseguradorasService, private daniosService: DaniosService, private peritosService: PeritosService, private siniestrosService: SiniestrosService,
              private router: Router, private estadosService: EstadosService, private route: ActivatedRoute) {

    this.aseguradoras = [];
    this.danios = [];
    this.peritos = [];
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
  }

  public enviar(): void {

  }
}
