import { Component, OnInit } from '@angular/core';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';

@Component({
  selector: 'app-listado-siniestros',
  templateUrl: './listado-siniestros.component.html',
  styleUrls: ['./listado-siniestros.component.scss']
})
export class ListadoSiniestrosComponent implements OnInit {
  public siniestros: Siniestro[];

  constructor(private siniestrosService: SiniestrosService) {
    this.siniestros = [];
  }

  async ngOnInit(): Promise<void> {
    this.siniestros = await this.siniestrosService.ObtenerTodos().toPromise();     
  }

  public editar(id: number): void {
    console.log(id);
  }
}
