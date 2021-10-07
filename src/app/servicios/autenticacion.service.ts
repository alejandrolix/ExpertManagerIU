import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService implements OnDestroy {
  private _estaLogueadoUsuario: boolean;
  private iniciarSesionSubscription: Subscription;
  private cerrarSesionSubscription: Subscription; 
  private redirigirInicioSesionSubscription: Subscription;
  private redirigirInicioSesion: Subject<boolean>;

  constructor(private usuariosService: UsuariosService, private router: Router) {
    let idUsuarioLogueado: number = this.usuariosService.obtenerIdUsuarioLogueado();

    if (idUsuarioLogueado === 0)    
      this._estaLogueadoUsuario = false;
    else
      this._estaLogueadoUsuario = true;

    this.iniciarSubjects();
  }

  public get estaLogueadoUsuario(): boolean {
    return this._estaLogueadoUsuario;
  }

  private iniciarSubjects(): void {
    this.iniciarSesionSubscription = this.usuariosService.iniciarSesionSubject
                                                         .pipe(
                                                            filter((respuesta: boolean) => respuesta)
                                                         )    
                                                         .subscribe(() => {
                                                            this._estaLogueadoUsuario = true;
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

                                                          this.redirigirInicioSesion.next(false);
                                                        });

    this.redirigirInicioSesion = new Subject<boolean>();
    this.redirigirInicioSesionSubscription = this.redirigirInicioSesion.subscribe((valor: boolean) => {      
      this._estaLogueadoUsuario = valor;
      this.router.navigateByUrl('/inicioSesion');
    });
  }

  ngOnDestroy(): void {
    this.iniciarSesionSubscription.unsubscribe();
    this.cerrarSesionSubscription.unsubscribe();
    this.redirigirInicioSesionSubscription.unsubscribe();
  }
}
