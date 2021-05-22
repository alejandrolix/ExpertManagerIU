import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Aseguradora } from 'src/app/interfaces/aseguradora';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { Usuario } from 'src/app/interfaces/usuario';
import { Permisos } from 'src/app/permisos/permisos';
import { AseguradorasService } from 'src/app/servicios/aseguradoras.service';
import { PeritosService } from 'src/app/servicios/peritos.service';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { SiniestrosService } from 'src/app/servicios/siniestros.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
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
  public idPeritoSeleccionado: number;
  public idAseguradoraSeleccionada: number;

  constructor(private siniestrosService: SiniestrosService, private router: Router, private permisosService: PermisosService,
              private aseguradorasService: AseguradorasService, private usuariosService: UsuariosService, private peritosService: PeritosService) {

    this.siniestros = [];
    this.idPeritoSeleccionado = 0;
    this.idAseguradoraSeleccionada = 0;
  }

  async ngOnInit(): Promise<void> {
    await this.filtrarSiniestros();
    this.aseguradoras = await this.aseguradorasService.obtenerTodas().toPromise();
  }

  public esPermisoAdministracion(): boolean {
    return Permisos.esPermisoAdministracion();
  }

  public async cerrarSiniestro(idSiniestro: number): Promise<void> {
    let esPeritoNoResponsable: boolean = this.permisosService.tienePermisoPeritoNoResponsable();

    if (esPeritoNoResponsable) {
      let idPeritoLogueado: number = this.usuariosService.obtenerIdUsuarioLogueado();
      let impReparacionDaniosPerito: number = await this.peritosService.obtenerImpReparacionDaniosPorIdPerito(idPeritoLogueado).toPromise();

      let siniestroActual: Siniestro | undefined = this.siniestros.find(siniestro => siniestro.id == idSiniestro);

      if (siniestroActual == undefined)
        return;

      let impValoracionDaniosSiniestro: number = Number(siniestroActual.impValoracionDanios.replace(',', '.').replace(' €', ''));

      if (impValoracionDaniosSiniestro > impReparacionDaniosPerito) {
        Swal.fire({
          title: 'No puede cerrar el siniestro porque el importe de valoración de daños supera el establecido al perito',
          icon: 'error',          
          confirmButtonColor: '#3085d6',          
          confirmButtonText: 'Aceptar',          
        });
      }
      else {
        let accion: SweetAlertResult = await Swal.fire({
          title: `¿Está seguro que desea cerrar el siniestro con id ${idSiniestro}?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar'
        });
    
        if (accion.isConfirmed) {      
          let respuesta: boolean = await this.siniestrosService.cerrar(idSiniestro).toPromise();
    
          if (respuesta)
            await this.filtrarSiniestros();
          else
            Swal.fire({
              title: `Ha habido un problema al cerrar el siniestro con id ${idSiniestro}`,
              icon: 'error',          
              confirmButtonColor: '#3085d6',          
              confirmButtonText: 'Aceptar',          
            });
        }
      }
    }    
  }

  public async filtrarSiniestros(): Promise<void> {
    if (Permisos.esPermisoAdministracion())
      this.siniestros = await this.siniestrosService.obtenerTodos(this.idPeritoSeleccionado, this.idAseguradoraSeleccionada).toPromise();
    else {
      let idPerito: number = this.usuariosService.obtenerIdUsuarioLogueado();

      if (this.permisosService.tienePermisoPeritoResponsable())
        this.siniestros = await this.siniestrosService.obtenerPorPeritoResponsable(idPerito, this.idAseguradoraSeleccionada).toPromise();
      else
        this.siniestros = await this.siniestrosService.obtenerPorPeritoNoResponsable(idPerito, this.idAseguradoraSeleccionada).toPromise();
    }
  }

  public async eliminarFiltros(): Promise<void> {
    this.idPeritoSeleccionado = 0;
    this.idAseguradoraSeleccionada = 0;
    
    this.filtrarSiniestros();
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
