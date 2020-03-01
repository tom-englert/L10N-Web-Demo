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
}

const initialL10NState: L10nState = {
  resources: new Resources()
};

export interface State {
  l10n: L10nState;
}

export const l10nReducer = createReducer(
  initialL10NState,
  on(loadL10NSuccess, (state, {data}) => {
    return {...state, resources: { ...new Resources(), ...data.Resources}};
  }),
  on(resetL10N, (state, {}) => {
    return {...state, resources: new Resources()};
  })
);

export const reducers: ActionReducerMap<State> = {
  l10n: l10nReducer
};

export const selectL10n = (state: State) => state.l10n;

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
