import { TestBed } from '@angular/core/testing';

import { InicioSesionGuard } from './inicio-sesion.guard';

describe('InicioSesionGuard', () => {
  let guard: InicioSesionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(InicioSesionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
