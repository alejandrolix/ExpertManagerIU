import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PeticionHttp } from '../clases/PeticionHttp';
import { Estado } from '../interfaces/estado';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  constructor(private peticionHttp: PeticionHttp) { }

  public obtenerTodos(): Observable<Estado[]> {
    return this.peticionHttp.get<Estado[]>(`${environment.urlApi}/Estados`);
  }
}
