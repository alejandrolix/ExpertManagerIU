import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Estado } from '../interfaces/estado';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  constructor(private http: HttpClient) { }

  public obtenerTodos(): Observable<Estado[]> {
    return this.http.get<Estado[]>(`${environment.urlApi}/Estados`);
  }
}
