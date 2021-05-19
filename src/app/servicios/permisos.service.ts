import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Permiso } from '../interfaces/permiso';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  constructor(private http: HttpClient) { }

  public obtenerTodos(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(`${environment.urlApi}/Permisos`);
  }
}
