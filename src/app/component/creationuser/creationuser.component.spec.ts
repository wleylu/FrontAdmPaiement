import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationuserComponent } from './creationuser.component';

describe('CreationuserComponent', () => {
  let component: CreationuserComponent;
  let fixture: ComponentFixture<CreationuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationuserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
