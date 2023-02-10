import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListadoPeritos } from 'src/app/interfaces/listadoPeritos';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';

@Component({
  selector: 'app-listado-siniestros',
  templateUrl: './listado-siniestros.component.html',
  styleUrls: ['./listado-siniestros.component.scss']
})
export class ListadoSiniestrosComponent implements OnInit, ListadoPeritos {
  public siniestros: Siniestro[];
  public idPeritoSeleccionado: number;
  public idAseguradoraSeleccionada: number;
  public esAdministrador: boolean;
  public esPeritoResponsable: boolean;
  public esPeritoNoResponsable: boolean;

  constructor(public siniestrosService: SiniestrosService,
              public router: Router,
              public permisosService: PermisosService,
              public activatedRoute: ActivatedRoute,
              public spinnerService: SpinnerService) {
  }

  ngOnInit(): void {
    this.esAdministrador = this.permisosService.tienePermisoAdministracion();
    this.esPeritoResponsable = this.permisosService.tienePermisoPeritoResponsable();
    this.esPeritoNoResponsable = this.permisosService.tienePermisoPeritoNoResponsable();
  }

  public verDetalles(idSiniestro: number): void {
    this.router.navigate([idSiniestro, 'detalles'], {
      relativeTo: this.activatedRoute
    });
  }
}
