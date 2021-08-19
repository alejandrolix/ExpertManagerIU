import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GenerarHashService } from 'src/app/servicios/generar-hash.service';
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

  constructor(private usuariosService: UsuariosService, private router: Router, private generarHashService: GenerarHashService) {
    this.mostrarSpinner = false;
  }

  ngOnInit(): void {    
    let idUsuarioLogueado: number = this.usuariosService.obtenerIdUsuarioLogueado();

    if (idUsuarioLogueado == 0) {
      this.usuariosService.cerrarSesionSubject.next(true);
      this.formInicioSesion = new FormGroup({
        usuario: new FormControl('', Validators.required),
        contrasenia: new FormControl('', Validators.required)
      });
    }
    else
      this.router.navigateByUrl('/inicio');
  }  

  public async iniciarSesion(): Promise<void> {
    this.mostrarSpinner = true;
    let nombre: string = this.formInicioSesion.get('usuario')?.value;
    let hashContrasenia: string = await this.generarHashService.generar(this.formInicioSesion.get('contrasenia')?.value);

    let credenciales = {
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
      localStorage.setItem('token', respuesta.token);

      this.usuariosService.iniciarSesionSubject.next(true);
    }

    this.mostrarSpinner = false;
  }
}
