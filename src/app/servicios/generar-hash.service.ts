import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenerarHashService {

  constructor() { }

  async generar(texto: string): Promise<string> {
    let msgUint8: Uint8Array = new TextEncoder().encode(texto);
    let hashBuffer: ArrayBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    let hashArray: number[] = Array.from(new Uint8Array(hashBuffer));
    let hashHex: string[] = hashArray.map(b => b.toString(16).padStart(2, '0'));
    let hash: string = hashHex.join('');

    return hash;
  }
}
