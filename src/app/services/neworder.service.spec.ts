import { TestBed, inject } from '@angular/core/testing';

import { NeworderService } from './neworder.service';

describe('NeworderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NeworderService]
    });
  });

  it('should be created', inject([NeworderService], (service: NeworderService) => {
    expect(service).toBeTruthy();
  }));
});
