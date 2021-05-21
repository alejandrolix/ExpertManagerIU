import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Permiso } from 'src/app/interfaces/permiso';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { sha256 } from 'js-sha256';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss']
})
export class CrearUsuarioComponent implements OnInit {
  public formCrearUsuario: FormGroup;
  public permisos: Permiso[];
  public esPeritoNoResponsable: boolean;

  constructor(private permisosService: PermisosService, private usuariosService: UsuariosService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.permisos = await this.permisosService.obtenerTodos().toPromise();    

    this.formCrearUsuario = new FormGroup({
      nombre: new FormControl('', Validators.required),
      contrasenia: new FormControl('', Validators.required),
      repetirContrasenia: new FormControl('', [Validators.required, this.comprobarContrasenias]),
      permiso: new FormControl(this.permisos[0].id)
    });
  }

  public permisoSeleccionado(e: any): void {
    this.formCrearUsuario.removeControl('impReparacionDanios');

    if (e.target.value == 3) {    // Permiso Perito no responsable
      this.esPeritoNoResponsable = true;
      this.formCrearUsuario.addControl('impReparacionDanios', new FormControl('', Validators.required));
    }      
    else
      this.esPeritoNoResponsable = false;
  }

  comprobarContrasenias(control: AbstractControl): {[key: string]: any} | null  {
    if (control.value != '' && (control.value !== control.parent?.get('contrasenia')?.value))
      return { contraseniasNoIguales: true };    

    return null;
  }

  public async enviar(): Promise<void> {
    if (!this.formCrearUsuario.valid)
      return;    

    let nombre: string = this.formCrearUsuario.get('nombre')?.value;
    let idPermiso: number = Number(this.formCrearUsuario.get('permiso')?.value);
    let hashContrasenia: string = sha256(this.formCrearUsuario.get('contrasenia')?.value);

    let usuario = {
      nombre: nombre,
      idPermiso: idPermiso,
      hashContrasenia: hashContrasenia
    };

    let respuesta: boolean = await this.usuariosService.crear(usuario).toPromise();

    if (respuesta) {
      let accion = await Swal.fire({
        title: 'Usuario creado correctamente',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

      if (accion.isConfirmed)
        this.router.navigateByUrl('/usuarios');
    }     
    else
      Swal.fire({
        title: 'Ha habido un error al crear el usuario',
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
}
