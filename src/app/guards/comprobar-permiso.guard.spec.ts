import { TestBed } from '@angular/core/testing';

import { ComprobarPermisoGuard } from './comprobar-permiso.guard';

describe('AccederRutaGuard', () => {
  let guard: ComprobarPermisoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ComprobarPermisoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
