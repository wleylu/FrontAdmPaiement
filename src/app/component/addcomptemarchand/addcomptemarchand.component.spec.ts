import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcomptemarchandComponent } from './addcomptemarchand.component';

describe('AddcomptemarchandComponent', () => {
  let component: AddcomptemarchandComponent;
  let fixture: ComponentFixture<AddcomptemarchandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcomptemarchandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcomptemarchandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
