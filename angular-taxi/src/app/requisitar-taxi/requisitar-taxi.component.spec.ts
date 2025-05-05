import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitarTaxiComponent } from './requisitar-taxi.component';

describe('RequisitarTaxiComponent', () => {
  let component: RequisitarTaxiComponent;
  let fixture: ComponentFixture<RequisitarTaxiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequisitarTaxiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequisitarTaxiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
