import {
  ActionReducerMap,
} from '@ngrx/store';
import {l10nReducer, L10nState} from './l10n.reducer';

export * from './l10n.actions';
export * from './l10n.effects';
export * from './l10n.reducer';

export interface State {
  l10n: L10nState;
}

export const reducers: ActionReducerMap<State> = {
  l10n: l10nReducer
};

