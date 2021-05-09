import { TestBed } from '@angular/core/testing';

import { SiniestrosService } from './siniestros.service';

describe('SiniestrosService', () => {
  let service: SiniestrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiniestrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
