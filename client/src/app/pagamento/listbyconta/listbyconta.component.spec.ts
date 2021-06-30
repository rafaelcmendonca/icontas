import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListbycontaComponent } from './listbyconta.component';

describe('ListbycontaComponent', () => {
  let component: ListbycontaComponent;
  let fixture: ComponentFixture<ListbycontaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListbycontaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListbycontaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
