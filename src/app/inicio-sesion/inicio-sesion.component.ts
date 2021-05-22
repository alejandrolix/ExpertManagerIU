import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { sha256 } from 'js-sha256';
import Swal from 'sweetalert2';
import { UsuariosService } from '../servicios/usuarios.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss']
})
export class InicioSesionComponent implements OnInit {
  public formInicioSesion: FormGroup;
  @Output() sesionIniciada = new EventEmitter<boolean>();

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.formInicioSesion = new FormGroup({
      usuario: new FormControl('', Validators.required),
      contrasenia: new FormControl('', Validators.required)
    });
  }

  public async iniciarSesion(): Promise<void> {
    let nombre: string = this.formInicioSesion.get('usuario')?.value;
    let hashContrasenia: string = sha256(this.formInicioSesion.get('contrasenia')?.value);

    let credenciales: any = {
      nombre: nombre,
      hashContrasenia: hashContrasenia
    };

    let respuesta: any = await this.usuariosService.iniciarSesion(credenciales).toPromise();

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

      this.sesionIniciada.emit(true);
    }
  }
}
