import { Component, OnInit } from '@angular/core';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';

@Component({
  selector: 'app-listado-siniestros',
  templateUrl: './listado-siniestros.component.html',
  styleUrls: ['./listado-siniestros.component.scss']
})
export class ListadoSiniestrosComponent implements OnInit {

  constructor(private siniestrosService: SiniestrosService) { }

  ngOnInit(): void {
    this.siniestrosService.ObtenerTodos().subscribe(data => {
      console.log(data);
    });
  }
}
