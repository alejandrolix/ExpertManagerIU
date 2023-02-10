import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroPeritoAseguradoraComponent } from './filtro-perito-aseguradora.component';

describe('FiltroPeritoAseguradoraComponent', () => {
  let component: FiltroPeritoAseguradoraComponent;
  let fixture: ComponentFixture<FiltroPeritoAseguradoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltroPeritoAseguradoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroPeritoAseguradoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
