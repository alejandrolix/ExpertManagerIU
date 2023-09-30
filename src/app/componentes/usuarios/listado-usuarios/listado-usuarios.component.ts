import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Alerta } from 'src/app/clases/Alerta';
import { AccionFormulario } from 'src/app/enumeraciones/accion-formulario.enum';
import { Usuario } from 'src/app/interfaces/usuario';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.scss']
})
export class ListadoUsuariosComponent implements OnInit {
  public usuarios: Usuario[];

  constructor(private router: Router,
              private usuariosService: UsuariosService,
              private activatedRoute: ActivatedRoute,
              private spinnerService: SpinnerService,
              private autenticacionService: AutenticacionService) { }

  async ngOnInit(): Promise<void> {
    this.spinnerService.mostrarSpinner();
    await this.obtenerUsuarios();
    this.spinnerService.ocultarSpinner();
  }

  private async obtenerUsuarios(): Promise<void> {
    this.usuarios = await firstValueFrom(this.usuariosService.obtenerTodos());
  }

  public editar(id: number): void {
    this.router.navigate([id, 'editar'], { relativeTo: this.activatedRoute, queryParams: { tipoAccion: AccionFormulario.Editar } });
  }

  public async eliminar(id: number): Promise<void> {
    let idUsuarioLogueado: number = this.autenticacionService.obtenerIdUsuario();

    if (id === idUsuarioLogueado) {
      Alerta.mostrarError('No se puede eliminar el usuario porque tiene iniciada la sesión');
      return;
    }

    let accion: SweetAlertResult = await Alerta.mostrarPreguntaAsincrono(`¿Está seguro que desea eliminar el usuario con id ${id}?`);

    if (!accion.isConfirmed)
      return;

    this.spinnerService.mostrarSpinner();

    try {
      await this.usuariosService.eliminar(id)
                                .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();

      return;
    }

    this.spinnerService.ocultarSpinner();
    await Alerta.mostrarOkAsincrono('Usuario eliminado correctamente');

    this.spinnerService.mostrarSpinner();
    await this.obtenerUsuarios();
    this.spinnerService.ocultarSpinner();
  }

  public crear(): void {
    this.router.navigate(['crear'], { relativeTo: this.activatedRoute, queryParams: { tipoAccion: AccionFormulario.Crear } });
  }
}
