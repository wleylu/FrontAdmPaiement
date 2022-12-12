import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComptesconnexionComponent } from './comptesconnexion.component';

describe('ComptesconnexionComponent', () => {
  let component: ComptesconnexionComponent;
  let fixture: ComponentFixture<ComptesconnexionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComptesconnexionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComptesconnexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
