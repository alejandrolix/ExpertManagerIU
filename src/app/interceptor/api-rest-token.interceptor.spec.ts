import { TestBed } from '@angular/core/testing';

import { ApiRestTokenInterceptor } from './api-rest-token.interceptor';

describe('ApiRestInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ApiRestTokenInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ApiRestTokenInterceptor = TestBed.inject(ApiRestTokenInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
