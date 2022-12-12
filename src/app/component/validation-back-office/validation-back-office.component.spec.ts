import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationBackOfficeComponent } from './validation-back-office.component';

describe('ValidationBackOfficeComponent', () => {
  let component: ValidationBackOfficeComponent;
  let fixture: ComponentFixture<ValidationBackOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationBackOfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
