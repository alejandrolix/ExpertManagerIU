import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private usuariosService: UsuariosService, private router: Router) {
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

  async crearHash(texto: string): Promise<string> {
    let msgUint8: Uint8Array = new TextEncoder().encode(texto);                           
    let hashBuffer: ArrayBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           
    let hashArray: number[] = Array.from(new Uint8Array(hashBuffer));                     
    let hashHex: string[] = hashArray.map(b => b.toString(16).padStart(2, '0'));
    let hash = hashHex.join(''); 

    return hash;
  }

  public async iniciarSesion(): Promise<void> {
    this.mostrarSpinner = true;
    let nombre: string = this.formInicioSesion.get('usuario')?.value;
    let hashContrasenia: string = await this.crearHash(this.formInicioSesion.get('contrasenia')?.value);

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

      this.usuariosService.iniciarSesionSubject.next(true);
    }

    this.mostrarSpinner = false;
  }
}
