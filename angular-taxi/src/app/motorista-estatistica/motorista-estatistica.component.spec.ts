import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoristaEstatisticaComponent } from './motorista-estatistica.component';

describe('MotoristaEstatisticaComponent', () => {
  let component: MotoristaEstatisticaComponent;
  let fixture: ComponentFixture<MotoristaEstatisticaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MotoristaEstatisticaComponent]
    });
    fixture = TestBed.createComponent(MotoristaEstatisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
