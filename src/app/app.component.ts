import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsuariosService } from './servicios/usuarios.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public estaSesionIniciada: boolean;
  public iniciarSesionSubscription: Subscription;
  public cerrarSesionSubscription: Subscription;

  constructor(private router: Router, private usuariosService: UsuariosService) { }     

  ngOnInit(): void {        
    let idUsuarioLogueado: number = this.usuariosService.obtenerIdUsuarioLogueado();

    if (idUsuarioLogueado == 0) {          
      this.estaSesionIniciada = false;
      this.router.navigateByUrl('/inicioSesion');
    }
    else
      this.estaSesionIniciada = true;
    
    this.iniciarSesionSubscription = this.usuariosService.iniciarSesionSubject
        .pipe(
          filter((respuesta: boolean) => respuesta)
        )    
        .subscribe(() => {
          this.estaSesionIniciada = true;
          this.router.navigateByUrl('/inicio');
        });

    this.cerrarSesionSubscription = this.usuariosService.cerrarSesionSubject
        .pipe(
          filter((respuesta: boolean) => respuesta)
        )    
        .subscribe(() => {      
          localStorage.removeItem('idUsuario');
          localStorage.removeItem('usuario');
          localStorage.removeItem('idPermiso');
          localStorage.removeItem('token');

          this.estaSesionIniciada = false;
          this.router.navigateByUrl('/inicioSesion');
        });
  }

  ngOnDestroy(): void {
    this.iniciarSesionSubscription.unsubscribe();
    this.cerrarSesionSubscription.unsubscribe();
  }
}
