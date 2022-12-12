import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErreurtransactionComponent } from './erreurtransaction.component';

describe('ErreurtransactionComponent', () => {
  let component: ErreurtransactionComponent;
  let fixture: ComponentFixture<ErreurtransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErreurtransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErreurtransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
