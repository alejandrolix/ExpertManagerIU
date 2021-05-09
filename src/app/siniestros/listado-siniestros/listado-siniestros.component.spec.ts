import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoSiniestrosComponent } from './listado-siniestros.component';

describe('ListadoSiniestrosComponent', () => {
  let component: ListadoSiniestrosComponent;
  let fixture: ComponentFixture<ListadoSiniestrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoSiniestrosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoSiniestrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
