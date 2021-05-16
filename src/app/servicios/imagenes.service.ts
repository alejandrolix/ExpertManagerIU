import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {

  constructor(private http: HttpClient) { }

  public subirImagen(envioImagen: any): Observable<boolean> {
    const formData = new FormData();    
    formData.append("Descripcion", envioImagen.descripcion); 
    formData.append("IdSiniestro", envioImagen.idSiniestro); 
    formData.append("Imagen", envioImagen.imagen, envioImagen.imagen.name);
      
    return this.http.post<boolean>(`${environment.urlApi}/Imagenes`, formData);
  }
}
