import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PeticionHttp } from '../clases/PeticionHttp';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  constructor(private peticionHttp: PeticionHttp) {}

  public obtenerTodos(): Observable<Usuario[]> {    
    return this.peticionHttp.get<Usuario[]>(`${environment.urlApi}/Usuarios`);
  }

  public obtenerPorId(id: number): Observable<Usuario> {    
    return this.peticionHttp.get<Usuario>(`${environment.urlApi}/Usuarios/${id}`);
  }

  public crear(usuario: any): Observable<boolean> {    
    return this.peticionHttp.post<boolean>(`${environment.urlApi}/Usuarios`, usuario);
  }

  public editar(usuario: any, id: number): Observable<boolean> {    
    return this.peticionHttp.hacerPeticionPut<boolean>(`${environment.urlApi}/Usuarios/${id}`, usuario);
  }

  public eliminar(id: number): Observable<boolean> {    
    return this.peticionHttp.hacerPeticionDelete<boolean>(`${environment.urlApi}/Usuarios/${id}`);
  }

  public iniciarSesion(credenciales: any): Observable<Usuario> {
    return this.peticionHttp.post<Usuario>(`${environment.urlApi}/Usuarios/IniciarSesion`, credenciales);
  }
}
