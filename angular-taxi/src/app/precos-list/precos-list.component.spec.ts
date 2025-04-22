import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecosListComponent } from './precos-list.component';

describe('PrecosListComponent', () => {
  let component: PrecosListComponent;
  let fixture: ComponentFixture<PrecosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrecosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrecosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
