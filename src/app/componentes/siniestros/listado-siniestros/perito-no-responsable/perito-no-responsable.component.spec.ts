import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeritoNoResponsableComponent } from './perito-no-responsable.component';

describe('PeritoNoResponsableComponent', () => {
  let component: PeritoNoResponsableComponent;
  let fixture: ComponentFixture<PeritoNoResponsableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeritoNoResponsableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeritoNoResponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
