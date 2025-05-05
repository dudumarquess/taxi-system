import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaViagensComponent } from './lista-viagens.component';

describe('ListaViagensComponent', () => {
  let component: ListaViagensComponent;
  let fixture: ComponentFixture<ListaViagensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaViagensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaViagensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
