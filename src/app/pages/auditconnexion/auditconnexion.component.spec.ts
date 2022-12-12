import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditconnexionComponent } from './auditconnexion.component';

describe('AuditconnexionComponent', () => {
  let component: AuditconnexionComponent;
  let fixture: ComponentFixture<AuditconnexionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditconnexionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditconnexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
