import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PeticionHttp } from '../clases/PeticionHttp';
import { Aseguradora } from '../interfaces/aseguradora';

@Injectable({
  providedIn: 'root'
})
export class AseguradorasService {

  constructor(private peticionHttp: PeticionHttp) { }

  public obtenerTodas(): Observable<Aseguradora[]> {
    return this.peticionHttp.get<Aseguradora[]>(`${environment.urlApi}/Aseguradoras`);
  }

  public eliminar(id: number): Observable<boolean> {
    return this.peticionHttp.delete<boolean>(`${environment.urlApi}/Aseguradoras/${id}`);
  }
}
