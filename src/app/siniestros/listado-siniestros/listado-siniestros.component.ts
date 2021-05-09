import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';

@Component({
  selector: 'app-listado-siniestros',
  templateUrl: './listado-siniestros.component.html',
  styleUrls: ['./listado-siniestros.component.scss']
})
export class ListadoSiniestrosComponent implements OnInit {
  public siniestros: Siniestro[];

  constructor(private siniestrosService: SiniestrosService, private router: Router) {
    this.siniestros = [];
  }

  async ngOnInit(): Promise<void> {
    this.siniestros = await this.siniestrosService.obtenerTodos().toPromise();     
  }

  public editar(id: number): void {
    console.log(id);
  }

  public eliminar(id: number): void {
    console.log(id);
  } 

  public crear(): void {
    this.router.navigateByUrl('/crearSiniestro');
  }
}
