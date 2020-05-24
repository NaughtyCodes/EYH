import { TestBed } from '@angular/core/testing';

import { UpdateEventResolverService } from './update-event-resolver.service';

describe('UpdateEventResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpdateEventResolverService = TestBed.get(UpdateEventResolverService);
    expect(service).toBeTruthy();
  });
});
