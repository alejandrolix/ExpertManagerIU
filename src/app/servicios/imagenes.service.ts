import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PeticionHttp } from '../clases/PeticionHttp';
import { Archivo } from '../interfaces/archivo';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {

  constructor(private http: HttpClient, private peticionHttp: PeticionHttp) { }

  public obtenerPorIdSiniestro(id: number): Observable<Archivo[]> {
    return this.peticionHttp.hacerPeticionGet<Archivo[]>(`${environment.urlApi}/Imagenes/ObtenerPorIdSiniestro/${id}`);
  }

  public subirImagen(envioImagen: any): Observable<boolean> {
    const formData = new FormData();    
    formData.append("Descripcion", envioImagen.descripcion); 
    formData.append("IdSiniestro", envioImagen.idSiniestro); 
    formData.append("Archivo", envioImagen.imagen, envioImagen.imagen.name);
      
    return this.peticionHttp.hacerPeticionPost<boolean>(`${environment.urlApi}/Imagenes`, formData);
  }

  public obtener(id: number): Observable<Blob> {          
    return this.http.get(`${environment.urlApi}/Imagenes/${id}`, { responseType: 'blob' }).pipe(
      map((res: Blob) => {        
        return new Blob([res], { type: res.type })
      })
    );
  }

  public eliminar(idImagen: number): Observable<boolean> {
    return this.peticionHttp.hacerPeticionDelete<boolean>(`${environment.urlApi}/Imagenes/${idImagen}`);
  }
}
