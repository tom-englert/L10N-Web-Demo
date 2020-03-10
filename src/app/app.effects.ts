import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {loadL10N, resetL10N, loadL10NSuccess} from './actions/l10n.actions';
import {catchError, filter, map, switchMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {EMPTY, Observable} from 'rxjs';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions, private httpClient: HttpClient) {
  }

  loadL10N$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadL10N),
      map(({culture}) => culture),
      filter(culture => !!culture),
      switchMap(culture => this.loadResources(culture))
    ));

  resetL10N$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadL10N),
      map(({culture}) => culture),
      filter(culture => !culture || culture === 'en'),
      map(data => resetL10N())
    ));

  private loadResources(culture: string): Observable<any> {
    const url = './assets/resources.' + culture + '.json';
    const request$ = this.httpClient.get(url).pipe(
      map(data => loadL10NSuccess({data, culture})),
      catchError((err, caught) => {
        console.log('resource not found:', culture, err);
        return EMPTY;
      }));

    return request$;
  }
}
