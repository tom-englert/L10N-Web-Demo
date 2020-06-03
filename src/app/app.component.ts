import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {L10nState, selectL10n, loadL10N, State} from './+state';
import {Observable} from 'rxjs';
import {Resources} from './resources';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private _culture = 'en';

  resources$: Observable<Resources>;
  l10n$: Observable<L10nState>;
  userName = 'Tom';

  constructor(private readonly store: Store<State>) {
    console.log('ctor');
    this.l10n$ = store.pipe(select(selectL10n));
    this.resources$ = this.l10n$.pipe(select(l10n => l10n.resources));
  }

  get culture(): string {
    return this._culture;
  }

  set culture(value: string) {
    this._culture = value;
    this.store.dispatch(loadL10N({culture: value}));
  }

  ngOnInit(): void {
  }
}
