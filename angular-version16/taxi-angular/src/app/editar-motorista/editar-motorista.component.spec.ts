import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarMotoristaComponent } from './editar-motorista.component';

describe('EditarMotoristaComponent', () => {
  let component: EditarMotoristaComponent;
  let fixture: ComponentFixture<EditarMotoristaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarMotoristaComponent]
    });
    fixture = TestBed.createComponent(EditarMotoristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
