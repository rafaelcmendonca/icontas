import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeradordepagamentosdialogComponent } from './geradordepagamentosdialog.component';

describe('GeradordepagamentosdialogComponent', () => {
  let component: GeradordepagamentosdialogComponent;
  let fixture: ComponentFixture<GeradordepagamentosdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeradordepagamentosdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeradordepagamentosdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
