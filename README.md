# L10N

This demo project shows how to localize your web application with just a few clicks using reactive state management in combination with [ResXResourceManager](https://github.com/tom-englert/ResXResourceManager).

This sample code is based on [Angular](https://angular.io/) and [ngrx](https://ngrx.io/), but it should work fine with any combination of UI framework an reactive state management.   

## Watch the demo

[![Demo Video](http://img.youtube.com/vi/z4YybsnF2UU/0.jpg)](http://www.youtube.com/watch?v=z4YybsnF2UU "Demo Video")

## Installing ResXResourceManager
You will need the latest version of ResXResourceManager. If you don't have installed it yet, get the latest version as described [here](https://github.com/tom-englert/ResXResourceManager/blob/master/README.md#installation).

The Visual Studio extension is recommended, but if you don't have VisualStudio, you can use the standalone version as well. Just note that the standalone version does not support the "Move To Resource" feature.  

## Setting up your application
If you start from the scratch, generate a [new application](https://angular.io/cli/generate) and setup the [ngrx store](https://ngrx.io/guide/schematics).

### 1. Integration of ResXResourceManager
To enable integration with ResXResourceManager you will need to add two files to your project:
- the `resx-manager.webexport.config` file in your `scr` root folder (next to `index.html`). This file configures the locations of the files generated by ResXResourceManager. 
- an empty resource file as a starting point. A good place is e.g. in the `l10n` sub-folder.  

You can just copy these two files from [here](./l10nScaffolding)

Now start Visual Studio or standalone ResXResourceManager and open your `src/` folder. 
This will trigger the initial creation of the `resources.ts` in the `app/` folder next to your `app.module.ts`

### 2. Setting up state, actions, epics and reducers:
#### State
Create a new state for localization and add it to your global state. 
The `Resources` object is the one created by ResXResourceManager in step #1, 
containing the neutral resources with the default values. 
```ts
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
```
#### Actions
You will need three actions to load culture specific resources, 
the typical load/loadSucceeded pair plus one optional to reset the resources to their invariant defaults.  
```ts
export const loadL10N = createAction(
  '[L10N] Load L10Ns',
  props<{ culture: string }>()
);

export const loadL10NSuccess = createAction(
  '[L10N] Load L10Ns Success',
  props<{ data: any }>()
);

export const resetL10N = createAction(
  '[L10N] Reset L10Ns',
);
```   
#### Effects
You will need two effects, one to load culture specific resources upon request, 
and one optional to reset the resources to the neutral defaults.
```ts
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
```
#### Reducers
Finally we need the reducers to update the state with the loaded resources:
```ts
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
```
