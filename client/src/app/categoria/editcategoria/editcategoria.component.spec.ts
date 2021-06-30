import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditcategoriaComponent } from './editcategoria.component';

describe('EditcategoriaComponent', () => {
  let component: EditcategoriaComponent;
  let fixture: ComponentFixture<EditcategoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditcategoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditcategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
