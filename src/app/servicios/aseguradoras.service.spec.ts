import { TestBed } from '@angular/core/testing';

import { AseguradorasService } from './aseguradoras.service';

describe('AseguradorasService', () => {
  let service: AseguradorasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AseguradorasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
