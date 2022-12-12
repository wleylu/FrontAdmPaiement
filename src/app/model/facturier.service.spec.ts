import { TestBed } from '@angular/core/testing';

import { FacturierService } from './facturier.service';

describe('FacturierService', () => {
  let service: FacturierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
