import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSiniestroComponent } from './editar-siniestro.component';

describe('EditarSiniestroComponent', () => {
  let component: EditarSiniestroComponent;
  let fixture: ComponentFixture<EditarSiniestroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarSiniestroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarSiniestroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
