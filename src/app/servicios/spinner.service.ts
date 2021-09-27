import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  public mostrarSpinnerSubject: Subject<boolean>;
  public mostrar: boolean;

  constructor() {
    this.mostrarSpinnerSubject = new Subject<boolean>();
    this.mostrar = false;
  }

  public mostrarSpinner(): void {
    this.mostrarSpinnerSubject.next(true);
  }

  public ocultarSpinner(): void {
    this.mostrarSpinnerSubject.next(false);
  }
}