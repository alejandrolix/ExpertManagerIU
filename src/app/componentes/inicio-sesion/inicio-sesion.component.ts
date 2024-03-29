import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Usuario } from 'src/app/interfaces/usuario';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';
import { UsuariosService } from '../../servicios/usuarios.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss']
})
export class InicioSesionComponent implements OnInit, AfterViewInit {
  public formInicioSesion: FormGroup;
  public deshabilitarBtnEntrar: boolean;

  @ViewChild('txtUsuario')
  public txtUsuario: ElementRef<HTMLInputElement>;

  constructor(private usuariosService: UsuariosService,
              private router: Router,
              private spinnerService: SpinnerService,
              private autenticacionService: AutenticacionService) { }

  ngAfterViewInit(): void {
    this.txtUsuario.nativeElement.focus();
  }

  ngOnInit(): void {
    this.deshabilitarBtnEntrar = false;
    this.spinnerService.ocultarSpinner();

    if (this.autenticacionService.estaLogueadoUsuario) {
      this.router.navigateByUrl('/inicio');
    }
    else {
      this.formInicioSesion = new FormGroup({
        usuario: new FormControl('', Validators.required),
        contrasenia: new FormControl('', Validators.required)
      });
    }
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
      usuario = await firstValueFrom(this.usuariosService.iniciarSesion(credenciales));
    } catch (error: any) {
      this.deshabilitarBtnEntrar = false;
      return;
    }

    this.deshabilitarBtnEntrar = false;

    this.autenticacionService.guardarCredencialesUsuario(usuario);
    this.spinnerService.ocultarSpinner();
    this.autenticacionService.iniciarSesion();
  }
}
