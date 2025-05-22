import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecoFormComponent } from './preco-form.component';

describe('PrecoFormComponent', () => {
  let component: PrecoFormComponent;
  let fixture: ComponentFixture<PrecoFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrecoFormComponent]
    });
    fixture = TestBed.createComponent(PrecoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
