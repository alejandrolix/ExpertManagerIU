import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { Alerta } from '../clases/Alerta';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private _conexion: signalR.HubConnection;

  constructor() {
    if (!this._conexion) {
      this._conexion = new signalR.HubConnectionBuilder()
                                  .withUrl(environment.urlHub)
                                  .build();
      this._conexion.start()
                    .catch(() => Alerta.mostrarError('Ha habido un error al crear el socket'));
    }
  }

  get signalR(): signalR.HubConnection {
    return this._conexion;
  }
}
