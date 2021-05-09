import { TestBed } from '@angular/core/testing';

import { DaniosService } from './danios.service';

describe('DaniosService', () => {
  let service: DaniosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DaniosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
