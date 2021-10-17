import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarSiniestroComponent } from './crear-editar-siniestro.component';

describe('CrearEditarSiniestroComponent', () => {
  let component: CrearEditarSiniestroComponent;
  let fixture: ComponentFixture<CrearEditarSiniestroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearEditarSiniestroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearEditarSiniestroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
