import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Siniestro } from '../interfaces/siniestro';

@Injectable({
  providedIn: 'root'
})
export class SiniestrosService {

  constructor(private http: HttpClient) { }

  public obtenerTodos(): Observable<Siniestro[]> {    
    return this.http.get<Siniestro[]>(`${environment.urlApi}/Siniestros`);
  }

  public obtenerPorId(id: number): Observable<Siniestro> {    
    return this.http.get<Siniestro>(`${environment.urlApi}/Siniestros/${id}`);
  }

  public crear(siniestro: any): Observable<any> {    
    return this.http.post<any>(`${environment.urlApi}/Siniestros`, siniestro);
  }

  public eliminar(id: number): Observable<boolean> {    
    return this.http.delete<boolean>(`${environment.urlApi}/Siniestros/${id}`);
  }
}
