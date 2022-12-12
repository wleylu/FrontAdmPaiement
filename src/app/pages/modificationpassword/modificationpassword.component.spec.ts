import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationpasswordComponent } from './modificationpassword.component';

describe('ModificationpasswordComponent', () => {
  let component: ModificationpasswordComponent;
  let fixture: ComponentFixture<ModificationpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificationpasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
