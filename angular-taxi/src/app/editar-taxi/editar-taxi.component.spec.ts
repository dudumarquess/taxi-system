import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarTaxiComponent } from './editar-taxi.component';

describe('EditarTaxiComponent', () => {
  let component: EditarTaxiComponent;
  let fixture: ComponentFixture<EditarTaxiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarTaxiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarTaxiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
