import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {loadL10N, loadL10NReset, loadL10NSuccess} from './actions/l10n.actions';
import {catchError, filter, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {EMPTY} from 'rxjs';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions, private httpClient: HttpClient) {
  }

  loadL10N$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadL10N),
      map(({culture}) => culture),
      filter(culture => !!culture),
      map(culture => './assets/resources.' + culture + '.json'),
      tap(text => console.log('loadL10NEffect URL', text)),
      switchMap(url => this.httpClient.get<string>(url).pipe(
        tap(data => console.log('loadL10NEffect Result', data)),
        map(data => loadL10NSuccess({data})),
        catchError((err, caught) => {
          console.log('resource not found:', err);
          return EMPTY;
        })
      )),
    ));

  loadL10NDefaults$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadL10N),
      map(({culture}) => culture),
      filter(culture => !culture),
      map(data => loadL10NReset())
    ));
}
