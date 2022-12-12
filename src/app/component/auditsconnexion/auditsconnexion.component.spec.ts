import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditsconnexionComponent } from './auditsconnexion.component';

describe('AuditsconnexionComponent', () => {
  let component: AuditsconnexionComponent;
  let fixture: ComponentFixture<AuditsconnexionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditsconnexionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditsconnexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
