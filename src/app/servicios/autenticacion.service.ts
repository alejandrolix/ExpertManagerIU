import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService implements OnDestroy {
  private _estaLogueadoUsuario: boolean;
  private iniciarSesionSubscription: Subscription;
  private cerrarSesionSubscription: Subscription;
  private iniciarSesionSubject: Subject<void>;
  private cerrarSesionSubject: Subject<void>;

  constructor(private router: Router) {
    let idUsuario: number = this.obtenerIdUsuario();

    if (idUsuario === 0)
      this._estaLogueadoUsuario = false;
    else
      this._estaLogueadoUsuario = true;

    this.iniciarSubjects();
  }

  public obtenerIdUsuario(): number {
    let idUsuario: string = sessionStorage.getItem('idUsuario') ?? '';

    if (idUsuario.length === 0)
      return 0;

    let idUsuarioNumero: number = parseInt(idUsuario);
    return idUsuarioNumero;
  }

  public obtenerToken(): string {
    let token: string = sessionStorage.getItem('token') ?? '';

    return token;
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
      this.eliminarCredencialesUsuario();
      this._estaLogueadoUsuario = false;
      this.router.navigateByUrl('/inicioSesion');
    });
  }

  public guardarCredencialesUsuario(usuario: Usuario): void {
    sessionStorage.setItem('idUsuario', usuario.id.toString());
    sessionStorage.setItem('usuario', usuario.nombre);
    sessionStorage.setItem('idPermiso', usuario.idPermiso.toString());
    sessionStorage.setItem('token', usuario.token);
  }

  private eliminarCredencialesUsuario(): void {
    sessionStorage.removeItem('idUsuario');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('idPermiso');
    sessionStorage.removeItem('token');
  }

  public cerrarSesion(): void {
    this.cerrarSesionSubject.next();
  }

  public iniciarSesion(): void {
    this.iniciarSesionSubject.next();
  }

  public obtenerNombreUsuario(): string {
    let nombre: string = sessionStorage.getItem('usuario') ?? '';
    return nombre;
  }

  ngOnDestroy(): void {
    this.iniciarSesionSubscription.unsubscribe();
    this.cerrarSesionSubscription.unsubscribe();
  }
}
