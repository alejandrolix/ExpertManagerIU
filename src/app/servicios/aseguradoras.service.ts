import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Aseguradora } from '../interfaces/aseguradora';

@Injectable({
  providedIn: 'root'
})
export class AseguradorasService {

  constructor(private http: HttpClient) { }

  public obtenerTodas(): Observable<Aseguradora[]> {
    return this.http.get<Aseguradora[]>(`${environment.urlApi}/Aseguradoras`);
  }
}
