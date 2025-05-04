import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoristaDashboardComponent } from './motorista-dashboard.component';

describe('MotoristaDashboardComponent', () => {
  let component: MotoristaDashboardComponent;
  let fixture: ComponentFixture<MotoristaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotoristaDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotoristaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
