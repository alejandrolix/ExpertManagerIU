import { Component, OnInit } from '@angular/core';
import { Aseguradora } from 'src/app/interfaces/aseguradora';
import { Danio } from 'src/app/interfaces/danio';
import { Usuario } from 'src/app/interfaces/usuario';
import { AseguradorasService } from 'src/app/servicios/aseguradoras.service';
import { DaniosService } from 'src/app/servicios/danios.service';

@Component({
  selector: 'app-crear-siniestro',
  templateUrl: './crear-siniestro.component.html',
  styleUrls: ['./crear-siniestro.component.scss']
})
export class CrearSiniestroComponent implements OnInit {
  public aseguradoras: Aseguradora[];
  public danios: Danio[];
  public peritos: Usuario[];

  constructor(private aseguradorasService: AseguradorasService, private daniosService: DaniosService) {
    this.aseguradoras = [];
    this.danios = [];
    this.peritos = [];
  }

  async ngOnInit(): Promise<void> {
    this.aseguradoras = await this.aseguradorasService.obtenerTodas().toPromise();    
    this.danios = await this.daniosService.obtenerTodos().toPromise();    
  }
}
