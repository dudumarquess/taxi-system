import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientePedidosComponent } from './cliente-pedidos.component';

describe('ClientePedidosComponent', () => {
  let component: ClientePedidosComponent;
  let fixture: ComponentFixture<ClientePedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientePedidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientePedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
