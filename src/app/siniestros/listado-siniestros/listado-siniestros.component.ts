import { Component, OnInit } from '@angular/core';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';

@Component({
  selector: 'app-listado-siniestros',
  templateUrl: './listado-siniestros.component.html',
  styleUrls: ['./listado-siniestros.component.scss']
})
export class ListadoSiniestrosComponent implements OnInit {

  constructor(private siniestrosService: SiniestrosService) { }

  async ngOnInit(): Promise<any> {
    let x = await this.siniestrosService.ObtenerTodos().toPromise(); 
    console.log(x);   
  }
}
