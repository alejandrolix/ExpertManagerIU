import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Aseguradora } from 'src/app/interfaces/aseguradora';
import { Siniestro } from 'src/app/interfaces/siniestro';
import { Usuario } from 'src/app/interfaces/usuario';
import { AseguradorasService } from 'src/app/servicios/aseguradoras.service';
import { MensajesService } from 'src/app/servicios/mensajes.service';
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
  public mostrarSpinner: boolean;

  constructor(private siniestrosService: SiniestrosService, private router: Router, private permisosService: PermisosService,
              private aseguradorasService: AseguradorasService, private usuariosService: UsuariosService, private peritosService: PeritosService,
              private mensajesService: MensajesService, private activatedRoute: ActivatedRoute) {

    this.siniestros = [];
    this.idPeritoSeleccionado = 0;
    this.idAseguradoraSeleccionada = 0;
    this.mostrarSpinner = true;
  }

  async ngOnInit(): Promise<void> {
    await this.filtrarSiniestros();    
    this.aseguradoras = await this.aseguradorasService.obtenerTodas().toPromise();
    this.peritos = await this.peritosService.obtenerTodos().toPromise();

    this.mostrarSpinner = false;
  }

  public tienePermisoAdministracion(): boolean {
    return this.permisosService.tienePermisoAdministracion();
  }

  public async cerrarSiniestro(idSiniestro: number): Promise<void> {
    let esPeritoNoResponsable: boolean = this.permisosService.tienePermisoPeritoNoResponsable();

    if (esPeritoNoResponsable) {
      let idPeritoLogueado: number = this.usuariosService.obtenerIdUsuarioLogueado();
      let impReparacionDaniosPerito: number;

      try {
        impReparacionDaniosPerito = await this.peritosService.obtenerImpReparacionDaniosPorIdPerito(idPeritoLogueado).toPromise();
      } catch (error) {
        await Swal.fire({
          title: 'Ha habido un error al obtener el importe de reparación de daños del perito. Inténtelo de nuevo',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
  
        return;
      }      

      let siniestroActual: Siniestro | undefined = this.siniestros.find(siniestro => siniestro.id == idSiniestro);

      if (siniestroActual == undefined)
        return;

      let impValoracionDaniosSiniestro: number = Number(siniestroActual.impValoracionDanios.replace(',', '.').replace(' €', ''));

      if (impValoracionDaniosSiniestro > impReparacionDaniosPerito) {
        await Swal.fire({
          title: 'No puede cerrar el siniestro porque el importe de valoración de daños supera el establecido al perito',
          icon: 'error',          
          confirmButtonColor: '#3085d6',          
          confirmButtonText: 'Aceptar',          
        });

        let idUsuarioCreado: number = this.usuariosService.obtenerIdUsuarioLogueado();
        let mensaje = {
          idUsuarioCreado: idUsuarioCreado,
          idSiniestro: idSiniestro
        };

        try {
          await this.mensajesService.crearMensajeRevisarCierre(mensaje).toPromise(); 
        } catch (error) {
          Swal.fire({
            title: 'Ha habido un error al crear el mensaje de cierre. Inténtelo de nuevo',
            icon: 'error',          
            confirmButtonColor: '#3085d6',          
            confirmButtonText: 'Aceptar',          
          });
        }        
      }
      else
        this.mostrarAlertaCerrarSiniestro(idSiniestro);
    } 
    else
      this.mostrarAlertaCerrarSiniestro(idSiniestro);  
  }

  private async mostrarAlertaCerrarSiniestro(idSiniestro: number): Promise<void> {
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
      let respuesta: boolean;

      try {
        respuesta = await this.siniestrosService.cerrar(idSiniestro).toPromise(); 
      } catch (error) {
        await Swal.fire({
          title: 'Ha habido un error al cerrar el siniestro. Inténtelo de nuevo',
          icon: 'error',          
          confirmButtonColor: '#3085d6',          
          confirmButtonText: 'Aceptar',          
        });

        return;
      }            

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

  public async filtrarSiniestros(): Promise<void> {
    if (this.permisosService.tienePermisoAdministracion())
      try {
        this.siniestros = await this.siniestrosService.obtenerTodos(this.idPeritoSeleccionado, this.idAseguradoraSeleccionada).toPromise();
      } catch (error) {
        Swal.fire({
          title: 'Ha habido un error al obtener los siniestros. Inténtelo de nuevo',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }     
    else {
      let idPerito: number = this.usuariosService.obtenerIdUsuarioLogueado();

      if (this.permisosService.tienePermisoPeritoResponsable())
        try {
          this.siniestros = await this.siniestrosService.obtenerPorPeritoResponsable(idPerito, this.idAseguradoraSeleccionada).toPromise();
        } catch (error) {
          Swal.fire({
            title: 'Ha habido un error al obtener los siniestros del perito responsable. Inténtelo de nuevo',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }        
      else
        try {
          this.siniestros = await this.siniestrosService.obtenerPorPeritoNoResponsable(idPerito, this.idAseguradoraSeleccionada).toPromise();
        } catch (error) {
          Swal.fire({
            title: 'Ha habido un error al obtener los siniestros del perito no responsable. Inténtelo de nuevo',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
    
          return;
        }        
    }
  }

  public async eliminarFiltros(): Promise<void> {
    this.idPeritoSeleccionado = 0;
    this.idAseguradoraSeleccionada = 0;
    
    this.filtrarSiniestros();
  }

  public editar(id: number): void {
    this.router.navigate(['editar', id], { relativeTo: this.activatedRoute });
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
      let respuesta: boolean;

      try {
        respuesta = await this.siniestrosService.eliminar(id).toPromise(); 

        await Swal.fire({
          title: 'Siniestro eliminado correctamente',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      } catch (error) {
        await Swal.fire({
          title: 'Ha habido un error al eliminar el siniestro. Inténtelo de nuevo',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
  
        return;
      }            

      if (respuesta)
        try {
          this.siniestros = await this.siniestrosService.obtenerTodos(this.idPeritoSeleccionado, this.idAseguradoraSeleccionada).toPromise();
        } catch (error) {
          Swal.fire({
            title: 'Ha habido un error al obtener los siniestros. Inténtelo de nuevo',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });    
        }        
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
    this.router.navigate(['crear'], { relativeTo: this.activatedRoute });
  }

  public verDetalles(id: number): void {
    this.router.navigate(['detalles', id], { relativeTo: this.activatedRoute });
  }
}
