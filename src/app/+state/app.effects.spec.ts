import {TestBed, inject} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {EMPTY} from 'rxjs';

import {L10nEffects} from './l10n.effects';

describe('AppEffects', () => {
  const actions$ = EMPTY;
  let effects: L10nEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        L10nEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject<L10nEffects>(L10nEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
