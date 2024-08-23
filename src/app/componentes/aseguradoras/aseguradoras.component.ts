import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Aseguradora } from 'src/app/interfaces/aseguradora';
import { AseguradorasService } from 'src/app/servicios/aseguradoras.service';

@Component({
  selector: 'app-aseguradoras',
  templateUrl: './aseguradoras.component.html',
  styleUrls: ['./aseguradoras.component.scss']
})
export class AseguradorasComponent implements OnInit {
  public aseguradoras: WritableSignal<Aseguradora[]>;

  constructor(private aseguradorasService: AseguradorasService) {
    
  }

  ngOnInit(): void {
    this.aseguradoras = signal([]);
  }

  public crear(): void {

  }

  public editar(idAseguradora: number): void {

  }

  public eliminar(idAseguradora: number): void {
    
  }
}
