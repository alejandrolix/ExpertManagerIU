import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Alerta } from 'src/app/clases/Alerta';
import { Usuario } from 'src/app/interfaces/usuario';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';
import { UsuariosService } from '../../servicios/usuarios.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss']
})
export class InicioSesionComponent implements OnInit {
  public formInicioSesion: FormGroup;
  public deshabilitarBtnEntrar: boolean;

  constructor(private usuariosService: UsuariosService, private router: Router, private spinnerService: SpinnerService,
              private autenticacionService: AutenticacionService) { }

  ngOnInit(): void {
    this.deshabilitarBtnEntrar = false;
    this.spinnerService.ocultarSpinner();

    if (this.autenticacionService.estaLogueadoUsuario)
      this.router.navigateByUrl('/inicio');
    else
      this.formInicioSesion = new FormGroup({
        usuario: new FormControl('', Validators.required),
        contrasenia: new FormControl('', Validators.required)
      });
  }

  public async iniciarSesion(): Promise<void> {
    this.spinnerService.mostrarSpinner();
    this.deshabilitarBtnEntrar = true;

    let nombre: string = this.formInicioSesion.get('usuario')?.value;
    let contrasenia: string = this.formInicioSesion.get('contrasenia')?.value;

    let credenciales: { nombre: string, contrasenia: string } = {
      nombre,
      contrasenia
    };

    let usuario: Usuario;

    try {
      usuario = await this.usuariosService.iniciarSesion(credenciales)
                                            .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      this.spinnerService.ocultarSpinner();
      this.deshabilitarBtnEntrar = false;

      return;
    }

    this.deshabilitarBtnEntrar = false;

    this.autenticacionService.guardarCredencialesUsuario(usuario);
    this.spinnerService.ocultarSpinner();
    this.autenticacionService.iniciarSesion();
  }
}
