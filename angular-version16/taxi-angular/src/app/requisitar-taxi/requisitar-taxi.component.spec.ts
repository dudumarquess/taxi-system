import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitarTaxiComponent } from './requisitar-taxi.component';

describe('RequisitarTaxiComponent', () => {
  let component: RequisitarTaxiComponent;
  let fixture: ComponentFixture<RequisitarTaxiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequisitarTaxiComponent]
    });
    fixture = TestBed.createComponent(RequisitarTaxiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
