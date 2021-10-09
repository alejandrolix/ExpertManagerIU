import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService implements OnDestroy {
  private _estaLogueadoUsuario: boolean;
  private iniciarSesionSubscription: Subscription;
  private cerrarSesionSubscription: Subscription; 
  private redirigirInicioSesionSubscription: Subscription;
  private redirigirInicioSesion: Subject<void>;
  private iniciarSesionSubject: Subject<void>;
  private cerrarSesionSubject: Subject<void>;

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
    this.iniciarSesionSubject = new Subject<void>();
    this.iniciarSesionSubscription = this.iniciarSesionSubject.subscribe(() => {
      this._estaLogueadoUsuario = true;
      this.router.navigateByUrl('/inicio');
    });

    this.cerrarSesionSubject = new Subject<void>();
    this.cerrarSesionSubscription = this.cerrarSesionSubject.subscribe(() => {      
      localStorage.removeItem('idUsuario');
      localStorage.removeItem('usuario');
      localStorage.removeItem('idPermiso');
      localStorage.removeItem('token');

      this.redirigirInicioSesion.next();
    });

    this.redirigirInicioSesion = new Subject<void>();
    this.redirigirInicioSesionSubscription = this.redirigirInicioSesion.subscribe(() => {
      this._estaLogueadoUsuario = false;
      this.router.navigateByUrl('/inicioSesion');
    });
  }

  public cerrarSesion(): void {
    this.cerrarSesionSubject.next();
  }

  public iniciarSesion(): void {
    this.iniciarSesionSubject.next();
  }

  ngOnDestroy(): void {
    this.iniciarSesionSubscription.unsubscribe();
    this.cerrarSesionSubscription.unsubscribe();
    this.redirigirInicioSesionSubscription.unsubscribe();
  }
}
