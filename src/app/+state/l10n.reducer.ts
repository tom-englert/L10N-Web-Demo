import {Resources} from '../resources';
import {createReducer, on} from '@ngrx/store';
import {loadL10NSuccess, resetL10N} from './l10n.actions';
import {State} from './index';

export interface L10nState {
  resources: Resources;
  culture: string;
}

const initialL10NState: L10nState = {
  resources: new Resources(),
  culture: 'en'
};

export const l10nReducer = createReducer(
  initialL10NState,
  on(loadL10NSuccess, (state, {data, culture}) => {
    const resources = Object.assign(new Resources(), data.Resources);
    return {...state, resources, culture};
  }),
  on(resetL10N, (state, {}) => {
    return initialL10NState;
  })
);

export const selectL10n = (state: State) => state.l10n;
