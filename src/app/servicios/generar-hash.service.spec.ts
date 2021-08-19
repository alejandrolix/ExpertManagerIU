import { TestBed } from '@angular/core/testing';

import { GenerarHashService } from './generar-hash.service';

describe('GenerarHashSha256Service', () => {
  let service: GenerarHashService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerarHashService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
