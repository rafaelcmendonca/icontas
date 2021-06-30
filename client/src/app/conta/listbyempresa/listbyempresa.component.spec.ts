import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListbyempresaComponent } from './listbyempresa.component';

describe('ListbyempresaComponent', () => {
  let component: ListbyempresaComponent;
  let fixture: ComponentFixture<ListbyempresaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListbyempresaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListbyempresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
