import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Alerta } from 'src/app/clases/Alerta';
import { Estadistica } from 'src/app/interfaces/estadistica';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  public estadistica: Estadistica;
  public tieneUsuarioPermisoAdministracion: boolean;

  constructor(private permisosService: PermisosService, private spinnerService: SpinnerService, private route: ActivatedRoute) { }

  ngOnInit(): void {  
    this.spinnerService.mostrarSpinner();    

    if (this.route.snapshot.data.respuesta.error) {
      Alerta.mostrarError(this.route.snapshot.data.respuesta.error);
      return;
    }
    
    this.estadistica = this.route.snapshot.data.respuesta.estadistica;        
    this.tieneUsuarioPermisoAdministracion = this.permisosService.tienePermisoAdministracion();    
    this.spinnerService.ocultarSpinner();   
  }
}
