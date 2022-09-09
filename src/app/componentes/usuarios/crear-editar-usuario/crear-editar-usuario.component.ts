import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, pluck } from 'rxjs/operators';
import { Alerta } from 'src/app/clases/Alerta';
import { Validadores } from 'src/app/clases/validadores';
import { AccionFormulario } from 'src/app/enumeraciones/accion-formulario.enum';
import { TipoPermiso } from 'src/app/enumeraciones/tipo-permiso.enum';
import { CrearEditarUsuarioVm } from 'src/app/interfaces/DTOs/crear-editar-usuario-vm';
import { Permiso } from 'src/app/interfaces/permiso';
import { Usuario } from 'src/app/interfaces/usuario';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-crear-editar-usuario',
  templateUrl: './crear-editar-usuario.component.html',
  styleUrls: ['./crear-editar-usuario.component.scss']
})
export class CrearEditarUsuarioComponent implements OnInit {
  public accionFormularioEnum: typeof AccionFormulario = AccionFormulario;
  public accionFormulario: AccionFormulario;
  public formCrearEditarUsuario: FormGroup;
  public permisos: Permiso[];
  private idUsuario: number;
  public mostrarCampoImpRepDanios: boolean;

  constructor(private spinnerService: SpinnerService, private route: ActivatedRoute, private location: Location, private permisosService: PermisosService, private usuariosService: UsuariosService,
              private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.spinnerService.mostrarSpinner();
    this.accionFormulario = Number(await this.route.queryParamMap
                                                   .pipe(
                                                     first(),
                                                     pluck('params'),
                                                     pluck('tipoAccion')
                                                   )
                                                   .toPromise());
    if (isNaN(this.accionFormulario)) {
      Alerta.mostrarError('El tipo de acción es incorrecto');
      this.irAtras();
    }

    try {
      this.permisos = await this.permisosService.obtenerTodos()
                                                .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();

      return;
    }

    if (this.accionFormulario == AccionFormulario.Crear)
      this.formCrearEditarUsuario = new FormGroup({
        nombre: new FormControl('', Validators.required),
        contrasenia: new FormControl('', Validators.required),
        repetirContrasenia: new FormControl('', [Validators.required, Validadores.comprobarContraseniasSonIguales]),
        permiso: new FormControl(this.permisos[0].id)
      });
    else {
      let usuario: Usuario;
      let idUsuario: number = Number(this.route.snapshot.paramMap.get('id'));

      if (isNaN(idUsuario)) {
        Alerta.mostrarError('El id del usuario no es correcto');
        return;
      }

      this.idUsuario = idUsuario;

      try {
        usuario = await this.usuariosService.obtenerPorId(this.idUsuario)
                                            .toPromise();
      } catch (error: any) {
        Alerta.mostrarError(error);
        this.spinnerService.ocultarSpinner();

        return;
      }

      this.formCrearEditarUsuario = new FormGroup({
        nombre: new FormControl(usuario.nombre, Validators.required),
        contrasenia: new FormControl(usuario.contrasenia, Validators.required),
        repetirContrasenia: new FormControl(usuario.contrasenia, [Validators.required, Validadores.comprobarContraseniasSonIguales]),
        permiso: new FormControl(usuario.idPermiso)
      });

      this.mostrarCampoImpRepDanios = false;

      if (usuario.idPermiso === TipoPermiso.PeritoNoResponsable) {
        this.mostrarCampoImpRepDanios = true;
        this.formCrearEditarUsuario.addControl('impReparacionDanios', new FormControl(usuario.impReparacionDanios, Validators.required));
      }
    }

    this.spinnerService.ocultarSpinner();
  }

  private irAtras(): void {
    this.location.back();
  }

  public async enviar(): Promise<void> {
    if (!this.formCrearEditarUsuario.valid)
      return;

    let nombre: string = this.formCrearEditarUsuario.get('nombre')?.value;
    let idPermiso: number = Number(this.formCrearEditarUsuario.get('permiso')?.value);
    let contrasenia: string = this.formCrearEditarUsuario.get('contrasenia')?.value;

    let usuario: CrearEditarUsuarioVm = {
      nombre,
      idPermiso,
      contrasenia,
      impReparacionDanios: 0
    };

    if (idPermiso === TipoPermiso.PeritoNoResponsable) {
      let impReparacionDanios: number = parseFloat(this.formCrearEditarUsuario.get('impReparacionDanios')?.value);
      usuario.impReparacionDanios = impReparacionDanios;
    }

    let accion: SweetAlertResult;

    if (this.accionFormulario == AccionFormulario.Editar) {
      try {
        await this.usuariosService.editar(usuario, this.idUsuario)
                                  .toPromise();
      } catch (error: any) {
        Alerta.mostrarError(error);
        return;
      }

      accion = await Alerta.mostrarOkAsincrono('Usuario editado correctamente');
    }
    else {
      try {
        await this.usuariosService.crear(usuario)
                                  .toPromise();
      } catch (error: any) {
        Alerta.mostrarError(error);
        return;
      }

      accion = await Alerta.mostrarOkAsincrono('Usuario creado correctamente');
    }

    if (accion.isConfirmed)
      this.router.navigateByUrl('/usuarios');
  }

  public comprobarPermisoSeleccionado(e: any): void {
    this.formCrearEditarUsuario.removeControl('impReparacionDanios');
    let idPermisoSeleccionado: number = parseInt(e.target.value);

    this.mostrarCampoImpRepDanios = false;

    if (idPermisoSeleccionado === TipoPermiso.PeritoNoResponsable) {
      this.mostrarCampoImpRepDanios = true;
      this.formCrearEditarUsuario.addControl('impReparacionDanios', new FormControl('', Validators.required));
    }
  }
}
