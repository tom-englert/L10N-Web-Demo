import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {loadL10N, resetL10N, loadL10NSuccess} from './actions/l10n.actions';
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
      switchMap(url => this.httpClient.get(url).pipe(
        map(data => loadL10NSuccess({data})),
        catchError((err, caught) => {
          console.log('resource not found:', err);
          return EMPTY;
        })
      )),
    ));

  resetL10N$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadL10N),
      map(({culture}) => culture),
      filter(culture => !culture || culture === 'en'),
      map(data => resetL10N())
    ));
}
