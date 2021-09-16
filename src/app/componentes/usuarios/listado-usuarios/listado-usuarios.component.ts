import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alerta } from 'src/app/clases/Alerta';
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
      this.usuarios = await this.usuariosService.obtenerTodos()
                                                .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
    }
    
    this.mostrarSpinner = false;
  }

  public editar(id: number): void {
    this.router.navigate(['editar', id], { relativeTo: this.activatedRoute });
  }

  public async eliminar(id: number): Promise<void> {    
    let accion: SweetAlertResult = await Alerta.mostrarPreguntaAsincrono(`¿Está seguro que desea eliminar el usuario con id ${id}?`);

    if (accion.isConfirmed) {
      let respuesta: boolean;

      try {
        respuesta = await this.usuariosService.eliminar(id)
                                              .toPromise();        
      } catch (error: any) {
        Alerta.mostrarError(error);
        return;
      }
      
      if (respuesta) {
        await Alerta.mostrarOkAsincrono('Usuario eliminado correctamente');        

        try {
          this.usuarios = await this.usuariosService.obtenerTodos()
                                                    .toPromise();
        } catch (error: any) {
          Alerta.mostrarError(error);
        }        
      }
    }
  }

  public crear(): void {
    this.router.navigate(['crear'], { relativeTo: this.activatedRoute });
  }
}
