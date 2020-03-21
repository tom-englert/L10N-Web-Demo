import {
  ActionReducerMap,
  createReducer,
  MetaReducer,
  on
} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {loadL10N, resetL10N, loadL10NSuccess} from '../actions/l10n.actions';
import {Resources} from '../resources';

export interface L10nState {
  resources: Resources;
  culture: string;
}

const initialL10NState: L10nState = {
  resources: new Resources(),
  culture: 'en'
};

export interface State {
  l10n: L10nState;
}

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

export const reducers: ActionReducerMap<State> = {
  l10n: l10nReducer
};

export const selectL10n = (state: State) => state.l10n;

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
