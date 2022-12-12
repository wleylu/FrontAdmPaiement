import { TestBed } from '@angular/core/testing';

import { ComptemarchandService } from './comptemarchand.service';

describe('ComptemarchandService', () => {
  let service: ComptemarchandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComptemarchandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
