import { TestBed } from '@angular/core/testing';

import { GeradordepagamentosService } from './geradordepagamentos.service';

describe('GeradordepagamentosService', () => {
  let service: GeradordepagamentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeradordepagamentosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
