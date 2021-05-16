import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Imagen } from '../interfaces/imagen';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {

  constructor(private http: HttpClient) { }

  public obtenerPorIdSiniestro(id: number): Observable<Imagen[]> {
    return this.http.get<Imagen[]>(`${environment.urlApi}/Imagenes/ObtenerPorIdSiniestro/${id}`);
  }

  public subirImagen(envioImagen: any): Observable<boolean> {
    const formData = new FormData();    
    formData.append("Descripcion", envioImagen.descripcion); 
    formData.append("IdSiniestro", envioImagen.idSiniestro); 
    formData.append("Imagen", envioImagen.imagen, envioImagen.imagen.name);
      
    return this.http.post<boolean>(`${environment.urlApi}/Imagenes`, formData);
  }

  public async obtener(id: number): Promise<Observable<Blob>> {    
    let contentType: string = await this.obtenerContentType(id).toPromise();

    let headers = new HttpHeaders();
    headers = headers.set('Accept', contentType);

    return this.http.get(`${environment.urlApi}/Imagenes/${id}`, { headers: headers, responseType: 'blob' }).pipe(
      map(res => {
        return new Blob([res], { type: contentType })
      })
    );
  }

  public obtenerContentType(idImagen: number): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    return this.http.get(`${environment.urlApi}/Imagenes/ObtenerContentType/${idImagen}`, { headers: headers, responseType: 'text' });
  }

  public eliminar(idImagen: number): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.urlApi}/Imagenes/${idImagen}`);
  }
}
