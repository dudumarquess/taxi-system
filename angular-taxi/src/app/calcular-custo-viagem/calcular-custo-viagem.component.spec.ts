import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcularCustoViagemComponent } from './calcular-custo-viagem.component';

describe('CalcularCustoViagemComponent', () => {
  let component: CalcularCustoViagemComponent;
  let fixture: ComponentFixture<CalcularCustoViagemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalcularCustoViagemComponent]
    });
    fixture = TestBed.createComponent(CalcularCustoViagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
