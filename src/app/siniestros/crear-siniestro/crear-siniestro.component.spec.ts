import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSiniestroComponent } from './crear-siniestro.component';

describe('CrearSiniestroComponent', () => {
  let component: CrearSiniestroComponent;
  let fixture: ComponentFixture<CrearSiniestroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearSiniestroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearSiniestroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
