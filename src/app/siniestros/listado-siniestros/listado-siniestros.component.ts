import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

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
        this.siniestros = await this.siniestrosService.obtenerTodos().toPromise();
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
}
