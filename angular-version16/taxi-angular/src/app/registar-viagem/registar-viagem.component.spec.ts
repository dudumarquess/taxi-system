import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarViagemComponent } from './registar-viagem.component';

describe('RegistarViagemComponent', () => {
  let component: RegistarViagemComponent;
  let fixture: ComponentFixture<RegistarViagemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistarViagemComponent]
    });
    fixture = TestBed.createComponent(RegistarViagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
