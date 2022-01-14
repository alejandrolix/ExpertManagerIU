import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoSiniestrosAdministracionComponent } from './listado-siniestros-administracion.component';

describe('ListadoSiniestrosAdministracionComponent', () => {
  let component: ListadoSiniestrosAdministracionComponent;
  let fixture: ComponentFixture<ListadoSiniestrosAdministracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoSiniestrosAdministracionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoSiniestrosAdministracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
