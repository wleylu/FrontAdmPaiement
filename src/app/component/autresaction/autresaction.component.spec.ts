import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutresactionComponent } from './autresaction.component';

describe('AutresactionComponent', () => {
  let component: AutresactionComponent;
  let fixture: ComponentFixture<AutresactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutresactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutresactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
