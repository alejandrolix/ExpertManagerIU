import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.scss']
})
export class ListadoUsuariosComponent implements OnInit {
  public usuarios: Usuario[];
  public mostrarSpinner: boolean;

  constructor(private router: Router, private usuariosService: UsuariosService, private activatedRoute: ActivatedRoute) {
    this.mostrarSpinner = true;
  }

  async ngOnInit(): Promise<void> {
    try {
      this.usuarios = await this.usuariosService.obtenerTodos().toPromise();
    } catch (error) {
      await Swal.fire({
        title: 'Ha habido un error al obtener los usuarios. Inténtelo de nuevo',
        icon: 'error',          
        confirmButtonColor: '#3085d6',          
        confirmButtonText: 'Aceptar',          
      });
    }
    
    this.mostrarSpinner = false;
  }

  public editar(id: number): void {
    this.router.navigate(['editar', id], { relativeTo: this.activatedRoute });
  }

  public async eliminar(id: number): Promise<void> {    
    let accion: SweetAlertResult = await Swal.fire({
      title: `¿Está seguro que desea eliminar el usuario con id ${id}?`,
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
        respuesta = await this.usuariosService.eliminar(id).toPromise();

        await Swal.fire({
          title: 'Usuario eliminado correctamente',
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
          title: 'Ha habido un error al eliminar el usuario. Inténtelo de nuevo',
          icon: 'error',          
          confirmButtonColor: '#3085d6',          
          confirmButtonText: 'Aceptar',          
        });

        return;
      }
      
      if (respuesta)
        try {
          this.usuarios = await this.usuariosService.obtenerTodos().toPromise();
        } catch (error) {
          Swal.fire({
            title: 'Ha habido un error al obtener los usuarios. Inténtelo de nuevo',
            icon: 'error',          
            confirmButtonColor: '#3085d6',          
            confirmButtonText: 'Aceptar',          
          });
        }        
      else
        Swal.fire({
          title: `Ha habido un problema al eliminar el usuario con id ${id}`,
          icon: 'error',          
          confirmButtonColor: '#3085d6',          
          confirmButtonText: 'Aceptar',          
        });
    }
  }

  public crear(): void {
    this.router.navigate(['crear'], { relativeTo: this.activatedRoute });
  }
}
