import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Documentacion } from '../interfaces/documentacion';

@Injectable({
  providedIn: 'root'
})
export class DocumentacionesService {

  constructor(private http: HttpClient) { }

  public obtenerPorIdSiniestro(id: number): Observable<Documentacion[]> {
    return this.http.get<Documentacion[]>(`${environment.urlApi}/Documentaciones/ObtenerPorIdSiniestro/${id}`);
  }

  public obtener(id: number): Observable<Blob> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.http.get(`${environment.urlApi}/Documentaciones/${id}`, { headers: headers, responseType: 'blob' }).pipe(
      map(res => {
        return new Blob([res], { type: 'application/pdf' })
      })
    );
  }

  public subir(idSiniestro: number, archivo: any): Observable<boolean> {
    const formData = new FormData();     
    formData.append("archivo", archivo, archivo.name);
      
    return this.http.post<boolean>(`${environment.urlApi}/Documentaciones/${idSiniestro}`, formData);
  }
}
