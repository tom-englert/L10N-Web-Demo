import {
  ActionReducerMap,
  createReducer,
  MetaReducer,
  on
} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {loadL10N, loadL10NSuccess} from '../actions/l10n.actions';

export interface L10nState {
}

const initialL10NState: L10nState = {
};

export interface State {
  l10n: L10nState;
}

export const l10nReducer = createReducer(
  initialL10NState,
  on(loadL10N, (state, {culture}) => {
    console.log('l10nReducer:', 'load', state, culture);
    return state;
  }),
  on(loadL10NSuccess, (state, {data}) => {
    console.log('l10nReducer:', 'success', state, data);
    return state;
  })
);

export const reducers: ActionReducerMap<State> = {
  l10n: l10nReducer
};

export const selectL10n = (state: State) => state.l10n;

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
