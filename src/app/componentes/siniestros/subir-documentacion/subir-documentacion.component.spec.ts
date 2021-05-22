import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirDocumentacionComponent } from './subir-documentacion.component';

describe('SubirDocumentacionComponent', () => {
  let component: SubirDocumentacionComponent;
  let fixture: ComponentFixture<SubirDocumentacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubirDocumentacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirDocumentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
