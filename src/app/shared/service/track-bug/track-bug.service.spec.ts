import { TestBed } from '@angular/core/testing';

import { TrackBugService } from './track-bug.service';

describe('TrackBugService', () => {
  let service: TrackBugService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackBugService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
