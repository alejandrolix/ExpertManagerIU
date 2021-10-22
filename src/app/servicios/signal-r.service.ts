import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private _conexion: signalR.HubConnection;

  constructor() {
    this._conexion = new signalR.HubConnectionBuilder()
                                .withUrl(environment.urlHub)
                                .build();
    this._conexion.start();
  }

  get conexion(): signalR.HubConnection {
    return this._conexion;
  }
}
