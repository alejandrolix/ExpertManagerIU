import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class PeritosService {

  constructor(private http: HttpClient) { }

  public obtenerTodos(): Observable<Usuario[]> {    
    return this.http.get<Usuario[]>(`${environment.urlApi}/Peritos`);
  }
}
