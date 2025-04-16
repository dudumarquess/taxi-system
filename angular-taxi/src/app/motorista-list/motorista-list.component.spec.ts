import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoristaListComponent } from './motorista-list.component'; 

describe('MotoristaListComponent', () => { 
  let component: MotoristaListComponent;
  let fixture: ComponentFixture<MotoristaListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MotoristaListComponent] 
    });
    fixture = TestBed.createComponent(MotoristaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
