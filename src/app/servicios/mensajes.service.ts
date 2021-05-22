import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor(private http: HttpClient) { }

  public crear(mensaje: any): Observable<boolean> {
    return this.http.post<boolean>(`${environment.urlApi}/Mensajes`, mensaje);
  }
}
