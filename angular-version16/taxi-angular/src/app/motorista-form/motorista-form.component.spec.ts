import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoristaFormComponent } from './motorista-form.component';

describe('MotoristaFormComponent', () => {
  let component: MotoristaFormComponent;
  let fixture: ComponentFixture<MotoristaFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MotoristaFormComponent]
    });
    fixture = TestBed.createComponent(MotoristaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
