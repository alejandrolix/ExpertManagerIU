import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Aseguradora } from 'src/app/interfaces/aseguradora';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { Usuario } from 'src/app/interfaces/usuario';
import { AseguradorasService } from 'src/app/servicios/aseguradoras.service';
import { PeritosService } from 'src/app/servicios/peritos.service';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-listado-siniestros',
  templateUrl: './listado-siniestros.component.html',
  styleUrls: ['./listado-siniestros.component.scss']
})
export class ListadoSiniestrosComponent implements OnInit {
  public siniestros: Siniestro[];
  public peritos: Usuario[];
  public aseguradoras: Aseguradora[];
  private idPeritoSeleccionado: number;
  private idAseguradoraSeleccionada: number;

  constructor(private siniestrosService: SiniestrosService, private router: Router, private peritosService: PeritosService,
              private aseguradorasService: AseguradorasService) {

    this.siniestros = [];
    this.idPeritoSeleccionado = 0;
    this.idAseguradoraSeleccionada = 0;
  }

  async ngOnInit(): Promise<void> {
    this.siniestros = await this.siniestrosService.obtenerTodos(this.idPeritoSeleccionado, this.idAseguradoraSeleccionada).toPromise();  
    this.peritos = await this.peritosService.obtenerTodos().toPromise();   
    this.aseguradoras = await this.aseguradorasService.obtenerTodas().toPromise();
  }

  public async filtrarPorPerito(e: Event): Promise<void> {
    let select = e.target as HTMLSelectElement;
    this.idPeritoSeleccionado = parseInt(select.value);    

    this.siniestros = await this.siniestrosService.obtenerTodos(this.idPeritoSeleccionado, this.idAseguradoraSeleccionada).toPromise();
  }

  public async filtrarPorAseguradora(e: Event): Promise<void> {
    let select = e.target as HTMLSelectElement;
    this.idAseguradoraSeleccionada = parseInt(select.value);    
    
    this.siniestros = await this.siniestrosService.obtenerTodos(this.idPeritoSeleccionado, this.idAseguradoraSeleccionada).toPromise();
  }

  public editar(id: number): void {
    this.router.navigate(['/editarSiniestro', id]);
  }

  public async eliminar(id: number): Promise<void> {    
    let accion: SweetAlertResult = await Swal.fire({
      title: `¿Está seguro que desea eliminar el siniestro con id ${id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    });

    if (accion.isConfirmed) {      
      let respuesta: boolean = await this.siniestrosService.eliminar(id).toPromise();

      if (respuesta)
        this.siniestros = await this.siniestrosService.obtenerTodos(this.idPeritoSeleccionado, this.idAseguradoraSeleccionada).toPromise();
      else
        Swal.fire({
          title: `Ha habido un problema al eliminar el siniestro con id ${id}`,
          icon: 'error',          
          confirmButtonColor: '#3085d6',          
          confirmButtonText: 'Aceptar',          
        });
    }
  } 

  public crear(): void {
    this.router.navigateByUrl('/crearSiniestro');
  }

  public verDetalles(id: number): void {
    this.router.navigate(['/detallesSiniestro', id]);
  }
}
