import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstconnexionComponent } from './firstconnexion.component';

describe('FirstconnexionComponent', () => {
  let component: FirstconnexionComponent;
  let fixture: ComponentFixture<FirstconnexionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstconnexionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstconnexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
