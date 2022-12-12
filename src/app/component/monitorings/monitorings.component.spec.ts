import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringsComponent } from './monitorings.component';

describe('MonitoringsComponent', () => {
  let component: MonitoringsComponent;
  let fixture: ComponentFixture<MonitoringsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
