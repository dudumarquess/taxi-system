import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecosListComponent } from './precos-list.component';

describe('PrecosListComponent', () => {
  let component: PrecosListComponent;
  let fixture: ComponentFixture<PrecosListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrecosListComponent]
    });
    fixture = TestBed.createComponent(PrecosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
