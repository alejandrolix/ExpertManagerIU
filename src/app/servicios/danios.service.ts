import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PeticionHttp } from '../clases/PeticionHttp';
import { Danio } from '../interfaces/danio';

@Injectable({
  providedIn: 'root'
})
export class DaniosService {

  constructor(private peticionHttp: PeticionHttp) { }

  public obtenerTodos(): Observable<Danio[]> {
    return this.peticionHttp.hacerPeticionGet<Danio[]>(`${environment.urlApi}/Danios`);
  }
}
