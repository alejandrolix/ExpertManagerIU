import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Alerta } from 'src/app/clases/Alerta';
import { TipoPermiso } from 'src/app/enumeraciones/tipo-permiso.enum';
import { Permiso } from 'src/app/interfaces/permiso';
import { Usuario } from 'src/app/interfaces/usuario';
import { GenerarHashService } from 'src/app/servicios/generar-hash.service';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {
  public formEditarUsuario: FormGroup;
  public permisos: Permiso[];
  private idUsuario: number;
  public esPeritoNoResponsable: boolean;
  public mostrarSpinner: boolean;

  constructor(private permisosService: PermisosService, private usuariosService: UsuariosService, private router: Router, private route: ActivatedRoute,
              private generarHashService: GenerarHashService) {

    this.mostrarSpinner = true;
  }

  async ngOnInit(): Promise<void> {
    this.idUsuario = Number(this.route.snapshot.paramMap.get('id'));    
    let usuario: Usuario;
    
    try {
      usuario = await this.usuariosService.obtenerPorId(this.idUsuario)
                                          .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.mostrarSpinner = false;

      return;
    }

    this.formEditarUsuario = new FormGroup({
      nombre: new FormControl(usuario.nombre, Validators.required),
      contrasenia: new FormControl(usuario.hashContrasenia, Validators.required),
      repetirContrasenia: new FormControl(usuario.hashContrasenia, [Validators.required, this.comprobarContrasenias]),
      permiso: new FormControl(usuario.idPermiso)
    });

    try {
      this.permisos = await this.permisosService.obtenerTodos()
                                                .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.mostrarSpinner = false;

      return;
    }                 

    if (usuario.idPermiso === TipoPermiso.PeritoNoResponsable) {
      this.esPeritoNoResponsable = true;
      this.formEditarUsuario.addControl('impReparacionDanios', new FormControl(usuario.impReparacionDanios, Validators.required));
    }      
    else
      this.esPeritoNoResponsable = false;

    this.mostrarSpinner = false;
  }

  public permisoSeleccionado(e: any): void {
    this.formEditarUsuario.removeControl('impReparacionDanios');
    let idPermisoSeleccionado: number = parseInt(e.target.value);

    if (idPermisoSeleccionado === TipoPermiso.PeritoNoResponsable) {
      this.esPeritoNoResponsable = true;
      this.formEditarUsuario.addControl('impReparacionDanios', new FormControl('', Validators.required));
    }      
    else
      this.esPeritoNoResponsable = false;
  }

  comprobarContrasenias(control: AbstractControl): {[key: string]: any} | null  {
    if (control.value !== control.parent?.get('contrasenia')?.value)
      return {
        contraseniasNoIguales: true
      };    

    return null;
  }

  public async enviar(): Promise<void> {
    if (!this.formEditarUsuario.valid)
      return;    

    let nombre: string = this.formEditarUsuario.get('nombre')?.value;
    let idPermiso: number = Number(this.formEditarUsuario.get('permiso')?.value);
    let hashContrasenia: string = await this.generarHashService.generar(this.formEditarUsuario.get('contrasenia')?.value);

    let usuario = {
      nombre: nombre,
      idPermiso: idPermiso,
      hashContrasenia: hashContrasenia,
      impReparacionDanios: 0
    };

    let respuesta: boolean;

    if (idPermiso === TipoPermiso.PeritoNoResponsable) {
      let impReparacionDanios: number = parseFloat(this.formEditarUsuario.get('impReparacionDanios')?.value);

      usuario.impReparacionDanios = impReparacionDanios;     
    }

    try {
      respuesta = await this.usuariosService.editar(usuario, this.idUsuario)
                                            .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      return;
    }      

    if (respuesta) {
      let accion: SweetAlertResult = await Alerta.mostrarOkAsincrono('Usuario editado correctamente');      

      if (accion.isConfirmed)
        this.router.navigateByUrl('/usuarios');
    }     
  }
  
  public permitirNumerosDecimales(e: KeyboardEvent): void {
    let caracteresPermitidos: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '.'];
    let teclaPulsada: string = e.key;

    if (caracteresPermitidos.indexOf(teclaPulsada) == -1)
      e.preventDefault();
  }
}
