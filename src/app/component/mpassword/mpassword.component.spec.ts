import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpasswordComponent } from './mpassword.component';

describe('MpasswordComponent', () => {
  let component: MpasswordComponent;
  let fixture: ComponentFixture<MpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MpasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
