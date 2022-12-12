import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagedeconnectionComponent } from './pagedeconnection.component';

describe('PagedeconnectionComponent', () => {
  let component: PagedeconnectionComponent;
  let fixture: ComponentFixture<PagedeconnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagedeconnectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagedeconnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
