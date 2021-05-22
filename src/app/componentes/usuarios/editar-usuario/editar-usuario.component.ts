import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { sha256 } from 'js-sha256';
import { Permiso } from 'src/app/interfaces/permiso';
import { Usuario } from 'src/app/interfaces/usuario';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import Swal from 'sweetalert2';

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

  constructor(private permisosService: PermisosService, private usuariosService: UsuariosService, private router: Router, private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    this.idUsuario = Number(this.route.snapshot.paramMap.get('id'));    
    let usuario: Usuario = await this.usuariosService.obtenerPorId(this.idUsuario).toPromise();     
    this.permisos = await this.permisosService.obtenerTodos().toPromise();

    this.formEditarUsuario = new FormGroup({
      nombre: new FormControl(usuario.nombre, Validators.required),
      contrasenia: new FormControl(usuario.hashContrasenia, Validators.required),
      repetirContrasenia: new FormControl(usuario.hashContrasenia, [Validators.required, this.comprobarContrasenias]),
      permiso: new FormControl(usuario.idPermiso)
    });

    if (usuario.idPermiso == 3) {    // Permiso Perito no responsable
      this.esPeritoNoResponsable = true;
      this.formEditarUsuario.addControl('impReparacionDanios', new FormControl(usuario.impReparacionDanios, Validators.required));
    }      
    else
      this.esPeritoNoResponsable = false;
  }

  public permisoSeleccionado(e: any): void {
    this.formEditarUsuario.removeControl('impReparacionDanios');

    if (e.target.value == 3) {    // Permiso Perito no responsable
      this.esPeritoNoResponsable = true;
      this.formEditarUsuario.addControl('impReparacionDanios', new FormControl('', Validators.required));
    }      
    else
      this.esPeritoNoResponsable = false;
  }

  comprobarContrasenias(control: AbstractControl): {[key: string]: any} | null  {
    if (control.value !== control.parent?.get('contrasenia')?.value)
      return { contraseniasNoIguales: true };    

    return null;
  }

  public async enviar(): Promise<void> {
    if (!this.formEditarUsuario.valid)
      return;    

    let nombre: string = this.formEditarUsuario.get('nombre')?.value;
    let idPermiso: number = Number(this.formEditarUsuario.get('permiso')?.value);
    let hashContrasenia: string = sha256(this.formEditarUsuario.get('contrasenia')?.value);

    let usuario = {
      nombre: nombre,
      idPermiso: idPermiso,
      hashContrasenia: hashContrasenia
    };

    let respuesta: boolean;

    if (idPermiso == 3) {
      let impReparacionDanios: number = parseFloat(this.formEditarUsuario.get('impReparacionDanios')?.value);

      let nuevoUsuario = {
        ...usuario,
        impReparacionDanios: impReparacionDanios
      };

      respuesta = await this.usuariosService.editar(nuevoUsuario, this.idUsuario).toPromise();
    }
    else
      respuesta = await this.usuariosService.editar(usuario, this.idUsuario).toPromise();

    if (respuesta) {
      let accion = await Swal.fire({
        title: 'Usuario editado correctamente',
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
        title: 'Ha habido un error al editar el usuario',
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

  public comprobarLetraPulsada(e: any): void {
    let caracteresPermitidos: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '.'];
    let teclaPulsada: string = e.key;

    if (caracteresPermitidos.indexOf(teclaPulsada) == -1)
      e.preventDefault();
  }
}
