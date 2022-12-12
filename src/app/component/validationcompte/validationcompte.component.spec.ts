import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationcompteComponent } from './validationcompte.component';

describe('ValidationcompteComponent', () => {
  let component: ValidationcompteComponent;
  let fixture: ComponentFixture<ValidationcompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationcompteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationcompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
