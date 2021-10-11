import { TestBed } from '@angular/core/testing';

import { ObtenerEstadisticaResolver } from './obtener-estadistica.resolver';

describe('ObtenerEstadisticaResolver', () => {
  let resolver: ObtenerEstadisticaResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ObtenerEstadisticaResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
