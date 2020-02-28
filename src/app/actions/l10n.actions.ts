import {createAction, props} from '@ngrx/store';

export const loadL10N = createAction(
  '[L10N] Load L10Ns',
  props<{ culture: string }>()
);

export const loadL10NSuccess = createAction(
  '[L10N] Load L10Ns Success',
  props<{ data: any }>()
);

export const loadL10NReset = createAction(
  '[L10N] Load L10Ns Reset',
);
