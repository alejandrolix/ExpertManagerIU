import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeritoResponsableComponent } from './perito-responsable.component';

describe('PeritoResponsableComponent', () => {
  let component: PeritoResponsableComponent;
  let fixture: ComponentFixture<PeritoResponsableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeritoResponsableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeritoResponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
