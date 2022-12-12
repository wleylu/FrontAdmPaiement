import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutreactionComponent } from './autreaction.component';

describe('AutreactionComponent', () => {
  let component: AutreactionComponent;
  let fixture: ComponentFixture<AutreactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutreactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutreactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
