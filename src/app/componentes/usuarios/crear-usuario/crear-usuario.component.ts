import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Permiso } from 'src/app/interfaces/permiso';
import { PermisosService } from 'src/app/servicios/permisos.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { SweetAlertResult } from 'sweetalert2';
import { Router } from '@angular/router';
import { GenerarHashService } from 'src/app/servicios/generar-hash.service';
import { Alerta } from 'src/app/clases/Alerta';
import { TipoPermiso } from 'src/app/enumeraciones/tipo-permiso.enum';
import { Validadores } from 'src/app/clases/validadores';
import { SpinnerService } from 'src/app/servicios/spinner.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss']
})
export class CrearUsuarioComponent implements OnInit {
  public formCrearUsuario: FormGroup;
  public permisos: Permiso[];
  public esPeritoNoResponsable: boolean;

  constructor(private permisosService: PermisosService, private usuariosService: UsuariosService, private router: Router, private generarHashService: GenerarHashService,
              private spinnerService: SpinnerService) {

    
  }

  async ngOnInit(): Promise<void> {
    try {
      this.permisos = await this.permisosService.obtenerTodos()
                                                .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      

      return;
    }        

    this.formCrearUsuario = new FormGroup({
      nombre: new FormControl('', Validators.required),
      contrasenia: new FormControl('', Validators.required),
      repetirContrasenia: new FormControl('', [Validators.required, Validadores.comprobarContraseniasSonIguales]),
      permiso: new FormControl(this.permisos[0].id)
    });

    
  }

  public mostrarSpinner(): boolean {
    return this.spinnerService.mostrar;
  }

  public permisoSeleccionado(e: any): void {
    this.formCrearUsuario.removeControl('impReparacionDanios');
    let idPermisoSeleccionado: number = parseInt(e.target.value);
    
    if (idPermisoSeleccionado === TipoPermiso.PeritoNoResponsable) {
      this.esPeritoNoResponsable = true;
      this.formCrearUsuario.addControl('impReparacionDanios', new FormControl('', Validators.required));
    }      
    else
      this.esPeritoNoResponsable = false;
  }  

  public async enviar(): Promise<void> {
    if (!this.formCrearUsuario.valid)
      return;    

    let nombre: string = this.formCrearUsuario.get('nombre')?.value;
    let idPermiso: number = Number(this.formCrearUsuario.get('permiso')?.value);
    let hashContrasenia: string = await this.generarHashService.generar(this.formCrearUsuario.get('contrasenia')?.value);

    let usuario = {
      nombre: nombre,
      idPermiso: idPermiso,
      hashContrasenia: hashContrasenia,
      impReparacionDanios: 0
    };

    let respuesta: boolean;    

    if (idPermiso === TipoPermiso.PeritoNoResponsable) {
      let impReparacionDanios: number = parseFloat(this.formCrearUsuario.get('impReparacionDanios')?.value);
      
      usuario.impReparacionDanios = impReparacionDanios;           
    }

    try {
      respuesta = await this.usuariosService.crear(usuario)
                                            .toPromise();
    } catch (error: any) {
      Alerta.mostrarError(error);
      return;
    }
      
    if (respuesta) {
      let accion: SweetAlertResult = await Alerta.mostrarOkAsincrono('Usuario creado correctamente');      

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
