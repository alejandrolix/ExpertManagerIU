import { TestBed } from '@angular/core/testing';

import { PeritosService } from './peritos.service';

describe('PeritosService', () => {
  let service: PeritosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeritosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
