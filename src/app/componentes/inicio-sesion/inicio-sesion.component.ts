import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Alerta } from 'src/app/clases/Alerta';
import { GenerarHashService } from 'src/app/servicios/generar-hash.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';
import { UsuariosService } from '../../servicios/usuarios.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss']
})
export class InicioSesionComponent implements OnInit {
  public formInicioSesion: FormGroup;

  constructor(private usuariosService: UsuariosService, private router: Router, private generarHashService: GenerarHashService,
              private spinnerService: SpinnerService) {

    this.spinnerService.ocultarSpinner();
  }

  ngOnInit(): void {       
    let idUsuarioLogueado: number = this.usuariosService.obtenerIdUsuarioLogueado();

    if (idUsuarioLogueado === 0)      
      this.formInicioSesion = new FormGroup({
        usuario: new FormControl('', Validators.required),
        contrasenia: new FormControl('', Validators.required)
      });    
    else
      this.router.navigateByUrl('/inicio');
  }  

  public async iniciarSesion(): Promise<void> {
    this.spinnerService.mostrarSpinner();
    let nombre: string = this.formInicioSesion.get('usuario')?.value;
    let hashContrasenia: string = await this.generarHashService.generar(this.formInicioSesion.get('contrasenia')?.value);

    let credenciales = {
      nombre: nombre,
      hashContrasenia: hashContrasenia
    };

    let respuesta: any;

    try {
      respuesta = await this.usuariosService.iniciarSesion(credenciales)
                            .toPromise(); 
    } catch (error: any) {
      Alerta.mostrarError(error); 
      this.spinnerService.ocultarSpinner();

      return;
    }    

    localStorage.setItem('idUsuario', respuesta.id);
    localStorage.setItem('usuario', credenciales.nombre);
    localStorage.setItem('idPermiso', respuesta.idPermiso);
    localStorage.setItem('token', respuesta.token);

    this.spinnerService.ocultarSpinner();
    this.usuariosService.iniciarSesionSubject.next(true);
  }
}
