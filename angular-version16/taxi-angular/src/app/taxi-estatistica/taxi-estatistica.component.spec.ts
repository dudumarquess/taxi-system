import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxiEstatisticaComponent } from './taxi-estatistica.component';

describe('TaxiEstatisticaComponent', () => {
  let component: TaxiEstatisticaComponent;
  let fixture: ComponentFixture<TaxiEstatisticaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaxiEstatisticaComponent]
    });
    fixture = TestBed.createComponent(TaxiEstatisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
