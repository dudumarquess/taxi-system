import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteLoginComponent } from './cliente-login.component';

describe('ClienteLoginComponent', () => {
  let component: ClienteLoginComponent;
  let fixture: ComponentFixture<ClienteLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClienteLoginComponent]
    });
    fixture = TestBed.createComponent(ClienteLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
