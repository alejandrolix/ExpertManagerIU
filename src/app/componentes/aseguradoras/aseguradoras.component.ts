import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Aseguradora } from 'src/app/interfaces/aseguradora';

@Component({
  selector: 'app-aseguradoras',
  templateUrl: './aseguradoras.component.html',
  styleUrls: ['./aseguradoras.component.scss']
})
export class AseguradorasComponent implements OnInit {
  public aseguradoras: WritableSignal<Aseguradora[]>;

  constructor() {

  }

  ngOnInit(): void {
    this.aseguradoras = signal([]);
  }

  public crear(): void {

  }
}
