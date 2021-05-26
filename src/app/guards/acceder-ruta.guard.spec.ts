import { TestBed } from '@angular/core/testing';

import { AccederRutaGuard } from './acceder-ruta.guard';

describe('AccederRutaGuard', () => {
  let guard: AccederRutaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AccederRutaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
