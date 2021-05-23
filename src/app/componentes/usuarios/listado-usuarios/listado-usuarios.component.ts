import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router, private usuariosService: UsuariosService) {
    this.mostrarSpinner = true;
  }

  async ngOnInit(): Promise<void> {
    this.usuarios = await this.usuariosService.obtenerTodos().toPromise();
    this.mostrarSpinner = false;
  }

  public editar(id: number): void {
    this.router.navigate(['editarUsuario', id]);
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
      let respuesta: boolean = await this.usuariosService.eliminar(id).toPromise();

      if (respuesta)
        this.usuarios = await this.usuariosService.obtenerTodos().toPromise();
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
    this.router.navigateByUrl('/crearUsuario');
  }
}
