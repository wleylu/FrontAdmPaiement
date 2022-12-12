import { TestBed } from '@angular/core/testing';

import { ComptesconnexionGuard } from './comptesconnexion.guard';

describe('ComptesconnexionGuard', () => {
  let guard: ComptesconnexionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ComptesconnexionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
