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

  public obtenerTodos(idPerito: number, idAseguradora: number): Observable<Siniestro[]> {    
    return this.http.get<Siniestro[]>(`${environment.urlApi}/Siniestros?idPerito=${idPerito}&idAseguradora=${idAseguradora}`);
  }

  public obtenerPorId(id: number): Observable<Siniestro> {    
    return this.http.get<Siniestro>(`${environment.urlApi}/Siniestros/${id}`);
  }

  public crear(siniestro: any): Observable<boolean> {    
    return this.http.post<boolean>(`${environment.urlApi}/Siniestros`, siniestro);
  }

  public editar(siniestro: any, id: number): Observable<boolean> {    
    return this.http.put<boolean>(`${environment.urlApi}/Siniestros/${id}`, siniestro);
  }

  public eliminar(id: number): Observable<boolean> {    
    return this.http.delete<boolean>(`${environment.urlApi}/Siniestros/${id}`);
  }
}
