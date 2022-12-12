import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteconnexionComponent } from './compteconnexion.component';

describe('CompteconnexionComponent', () => {
  let component: CompteconnexionComponent;
  let fixture: ComponentFixture<CompteconnexionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompteconnexionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompteconnexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
