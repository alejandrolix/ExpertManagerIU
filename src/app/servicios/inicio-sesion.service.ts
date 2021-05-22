import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class InicioSesionService {

  constructor(private http: HttpClient) { }

  public iniciarSesion(credenciales: any): Observable<Usuario> {
    return this.http.post<Usuario>(`${environment.urlApi}/InicioSesion`, credenciales);
  }
}