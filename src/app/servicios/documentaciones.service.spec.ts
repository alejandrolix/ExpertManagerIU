import { TestBed } from '@angular/core/testing';

import { DocumentacionesService } from './documentaciones.service';

describe('DocumentacionService', () => {
  let service: DocumentacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
