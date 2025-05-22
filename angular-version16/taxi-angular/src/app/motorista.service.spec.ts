import { TestBed } from '@angular/core/testing';

import { MotoristaService } from './motorista.service';

describe('MotoristaService', () => {
  let service: MotoristaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotoristaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
