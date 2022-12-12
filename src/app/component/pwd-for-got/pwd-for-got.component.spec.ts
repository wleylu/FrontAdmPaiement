import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwdForGotComponent } from './pwd-for-got.component';

describe('PwdForGotComponent', () => {
  let component: PwdForGotComponent;
  let fixture: ComponentFixture<PwdForGotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PwdForGotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PwdForGotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
