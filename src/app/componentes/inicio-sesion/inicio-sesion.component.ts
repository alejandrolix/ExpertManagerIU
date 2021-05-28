import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { sha256 } from 'js-sha256';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../servicios/usuarios.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss']
})
export class InicioSesionComponent implements OnInit {
  public formInicioSesion: FormGroup;
  public mostrarSpinner: boolean;

  constructor(private usuariosService: UsuariosService) {
    this.mostrarSpinner = false;
  }

  ngOnInit(): void {    
    let idUsuarioLogueado: number = this.usuariosService.obtenerIdUsuarioLogueado();

    if (idUsuarioLogueado != 0)
      this.usuariosService.cerrarSesionSubject.next(true);

    this.formInicioSesion = new FormGroup({
      usuario: new FormControl('', Validators.required),
      contrasenia: new FormControl('', Validators.required)
    });
  }

  public async iniciarSesion(): Promise<void> {
    this.mostrarSpinner = true;
    let nombre: string = this.formInicioSesion.get('usuario')?.value;
    let hashContrasenia: string = sha256(this.formInicioSesion.get('contrasenia')?.value);

    let credenciales: any = {
      nombre: nombre,
      hashContrasenia: hashContrasenia
    };

    let respuesta: any;

    try {
      respuesta = await this.usuariosService.iniciarSesion(credenciales).toPromise(); 
    } catch (error) {
      await Swal.fire({
        title: 'Ha habido un error al iniciar sesión. Inténtelo de nuevo',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        icon: 'error',
        confirmButtonText: 'Aceptar'
      }); 

      this.mostrarSpinner = false;
      return;
    }    

    if (!respuesta)
      Swal.fire({
        title: 'El usuario y/o la contraseña no son correctos',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });      
    else {
      localStorage.setItem('idUsuario', respuesta.id);
      localStorage.setItem('usuario', credenciales.nombre);
      localStorage.setItem('idPermiso', respuesta.idPermiso);

      this.usuariosService.iniciarSesionSubject.next(true);
    }

    this.mostrarSpinner = false;
  }
}
