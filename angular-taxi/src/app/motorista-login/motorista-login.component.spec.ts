import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoristaLoginComponent } from './motorista-login.component';

describe('MotoristaLoginComponent', () => {
  let component: MotoristaLoginComponent;
  let fixture: ComponentFixture<MotoristaLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotoristaLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotoristaLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
