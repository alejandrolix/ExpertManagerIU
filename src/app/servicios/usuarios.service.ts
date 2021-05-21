import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

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
}
