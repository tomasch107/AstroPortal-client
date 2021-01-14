import { TestBed } from '@angular/core/testing';

import { MessageService } from './error-service.service';

describe('ErrorServiceService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
