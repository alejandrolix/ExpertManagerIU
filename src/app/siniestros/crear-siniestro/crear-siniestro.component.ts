import { Component, OnInit } from '@angular/core';
import { Aseguradora } from 'src/app/interfaces/aseguradora';
import { AseguradorasService } from 'src/app/servicios/aseguradoras.service';

@Component({
  selector: 'app-crear-siniestro',
  templateUrl: './crear-siniestro.component.html',
  styleUrls: ['./crear-siniestro.component.scss']
})
export class CrearSiniestroComponent implements OnInit {
  public aseguradoras: Aseguradora[];

  constructor(private aseguradorasService: AseguradorasService) {
    this.aseguradoras = [];
  }

  async ngOnInit(): Promise<void> {
    this.aseguradoras = await this.aseguradorasService.obtenerTodas().toPromise();    
  }
}
