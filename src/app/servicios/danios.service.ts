import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Danio } from '../interfaces/danio';

@Injectable({
  providedIn: 'root'
})
export class DaniosService {

  constructor(private http: HttpClient) { }

  public obtenerTodos(): Observable<Danio[]> {
    return this.http.get<Danio[]>(`${environment.urlApi}/Danios`);
  }
}
