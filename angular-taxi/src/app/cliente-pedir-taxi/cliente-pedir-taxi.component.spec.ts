import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientePedirTaxiComponent } from './cliente-pedir-taxi.component';

describe('ClientePedirTaxiComponent', () => {
  let component: ClientePedirTaxiComponent;
  let fixture: ComponentFixture<ClientePedirTaxiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientePedirTaxiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientePedirTaxiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
