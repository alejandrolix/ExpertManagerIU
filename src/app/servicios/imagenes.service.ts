import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  public eliminar(idImagen: number): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.urlApi}/Imagenes/${idImagen}`);
  }
}
