import { TestBed } from '@angular/core/testing';

import { CreationcompteService } from './creationcompte.service';

describe('CreationcompteService', () => {
  let service: CreationcompteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreationcompteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
