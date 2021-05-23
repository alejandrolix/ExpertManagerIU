import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  public iniciarSesionSubject: Subject<boolean> = new Subject<boolean>();
  public cerrarSesionSubject: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  public obtenerTodos(): Observable<Usuario[]> {    
    return this.http.get<Usuario[]>(`${environment.urlApi}/Usuarios`);
  }

  public obtenerPorId(id: number): Observable<Usuario> {    
    return this.http.get<Usuario>(`${environment.urlApi}/Usuarios/${id}`);
  }

  public crear(usuario: any): Observable<boolean> {    
    return this.http.post<boolean>(`${environment.urlApi}/Usuarios`, usuario);
  }

  public editar(usuario: any, id: number): Observable<boolean> {    
    return this.http.put<boolean>(`${environment.urlApi}/Usuarios/${id}`, usuario);
  }

  public eliminar(id: number): Observable<boolean> {    
    return this.http.delete<boolean>(`${environment.urlApi}/Usuarios/${id}`);
  }

  public iniciarSesion(credenciales: any): Observable<Usuario> {
    return this.http.post<Usuario>(`${environment.urlApi}/Usuarios/IniciarSesion`, credenciales);
  }

  public obtenerIdUsuarioLogueado(): number {
    let idUsuario: string | null = localStorage.getItem('idUsuario');

    if (idUsuario == null)
        return 0;

    let idUsuarioNumero: number = parseInt(idUsuario);

    return idUsuarioNumero;
  }
}
