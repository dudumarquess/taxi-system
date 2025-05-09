import { TestBed } from '@angular/core/testing';

import { ViagemService } from './viagem.service';

describe('ViagemService', () => {
  let service: ViagemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViagemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
