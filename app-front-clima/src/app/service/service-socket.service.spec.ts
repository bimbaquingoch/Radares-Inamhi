import { TestBed } from '@angular/core/testing';

import { ServiceSocketService } from './service-socket.service';

describe('ServiceSocketService', () => {
  let service: ServiceSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
