import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosPendentesComponent } from './pedidos-pendentes.component';

describe('PedidosPendentesComponent', () => {
  let component: PedidosPendentesComponent;
  let fixture: ComponentFixture<PedidosPendentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosPendentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosPendentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
