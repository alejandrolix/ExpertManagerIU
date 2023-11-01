import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroPeritoAseguradora } from './filtro-perito-aseguradora';

describe('FiltroPeritoAseguradoraComponent', () => {
  let component: FiltroPeritoAseguradora;
  let fixture: ComponentFixture<FiltroPeritoAseguradora>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltroPeritoAseguradora ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroPeritoAseguradora);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
