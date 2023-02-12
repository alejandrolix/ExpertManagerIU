import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private mostrarSpinnerSubject: BehaviorSubject<boolean>;
  public mostrar: boolean;
  public mostrarSpinnerObs: Observable<boolean>;

  constructor() {
    this.mostrarSpinnerSubject = new BehaviorSubject<boolean>(false);
    this.mostrarSpinnerObs = this.mostrarSpinnerSubject.asObservable();
  }

  public mostrarSpinner(): void {
    this.mostrarSpinnerSubject.next(true);
  }

  public ocultarSpinner(): void {
    this.mostrarSpinnerSubject.next(false);
  }
}
