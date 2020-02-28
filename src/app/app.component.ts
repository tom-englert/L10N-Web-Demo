import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {selectL10n, State} from './reducers';
import {Observable} from 'rxjs';
import {Resources} from './resources';
import {loadL10N} from './actions/l10n.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private _culture = 'en';

  resources$: Observable<Resources>;

  constructor(private readonly store: Store<State>) {
    console.log('ctor');
    this.resources$ = store.pipe(select(selectL10n), select(l10n => l10n.resources));
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
