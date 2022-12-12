import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationmarchandComponent } from './creationmarchand.component';

describe('CreationmarchandComponent', () => {
  let component: CreationmarchandComponent;
  let fixture: ComponentFixture<CreationmarchandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationmarchandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationmarchandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
