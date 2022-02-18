import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';

@Component({
  selector: 'app-listado-siniestros-administracion',
  templateUrl: './listado-siniestros-administracion.component.html',
  styleUrls: ['./listado-siniestros-administracion.component.scss']
})
export class ListadoSiniestrosAdministracionComponent implements OnInit {
  public siniestros: Siniestro[];

  @Output()
  public eventoVerDetalles: EventEmitter<number>;

  constructor(private siniestrosService: SiniestrosService) {
    this.eventoVerDetalles = new EventEmitter<number>();
  }

  async ngOnInit(): Promise<void> {
    this.siniestros = await this.siniestrosService.obtenerTodos(0, 0).toPromise();
  }

  public abrirSiniestro(idSiniestro: number): void {
    console.log('abierto')
  }
}
