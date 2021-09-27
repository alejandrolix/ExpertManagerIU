import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PeticionHttp } from '../clases/PeticionHttp';
import { Archivo } from '../interfaces/archivo';

@Injectable({
  providedIn: 'root'
})
export class DocumentacionesService {

  constructor(private http: HttpClient, private peticionHttp: PeticionHttp) { }

  public obtenerPorIdSiniestro(id: number): Observable<Archivo[]> {
    return this.peticionHttp.hacerPeticionGet<Archivo[]>(`${environment.urlApi}/Documentaciones/ObtenerPorIdSiniestro/${id}`);
  }

  public obtener(id: number): Observable<Blob> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.peticionHttp.hacerPeticionGetConOpciones(`${environment.urlApi}/Documentaciones/${id}`, { headers: headers, responseType: 'blob' })
                            .pipe(
                                  map((res: any) => {
                                    return new Blob([res], { type: 'application/pdf' })
                                  })
    );
  }

  public subirDocumentacion(documentacion: any): Observable<boolean> {
    const formData = new FormData();    
    formData.append("Descripcion", documentacion.descripcion); 
    formData.append("IdSiniestro", documentacion.idSiniestro); 
    formData.append("Archivo", documentacion.archivo, documentacion.archivo.name);
      
    return this.http.post<boolean>(`${environment.urlApi}/Documentaciones`, formData);
  }

  public eliminar(idDocumentacion: number): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.urlApi}/Documentaciones/${idDocumentacion}`);
  }
}
