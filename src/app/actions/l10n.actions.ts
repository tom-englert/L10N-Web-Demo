import {createAction, props} from '@ngrx/store';

export const loadL10N = createAction(
  '[L10N] Load L10Ns',
  props<{ culture: string }>()
);

export const loadL10NSuccess = createAction(
  '[L10N] Load L10Ns Success',
  props<{ data: any, culture: string }>()
);

export const resetL10N = createAction(
  '[L10N] Reset L10Ns',
);
