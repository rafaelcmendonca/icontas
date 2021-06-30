import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowbudgetComponent } from './showbudget.component';

describe('ShowbudgetComponent', () => {
  let component: ShowbudgetComponent;
  let fixture: ComponentFixture<ShowbudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowbudgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowbudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
