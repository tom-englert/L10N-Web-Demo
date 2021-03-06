# L10N

This demo project shows how to localize your web application with just a few clicks using
reactive state management in combination with [ResXResourceManager](https://github.com/dotnet/ResXResourceManager).

This sample code is based on [Angular](https://angular.io/) and [ngrx](https://ngrx.io/),
but it should work fine with any other UI framework and state management.

## Watch the demo video

[![Click to watch the demo video](http://img.youtube.com/vi/qJA4dGdbUbc/0.jpg)](http://www.youtube.com/watch?v=qJA4dGdbUbc "Click to watch the demo video")

## The Concept
Neutral (usually en-US) resources are provided not as .json files but as one or more typescript classes,
mapping the keys to their default text:
```ts
export class Resources {
  MAINPAGE_WELCOME = "Welcome";
  MAINPAGE_APPNAME = "Localized App";
}
```

```ts
resources = new Resources();
```
This file is available at compile time, so you can benefit from static type checking and code completion.
```ts
const text = resources.MAINPAGE_WELCOME;
```
Trying to access non-existing resources will result in compile errors.

All other languages are provides as .json files, so at runtime the members of the `Resources` class can be easily overwritten dynamically with their localized content:
```json
{
  "Resources": {
    "MAINPAGE_APPNAME": "Lokalisierte Anwendung",
    "MAINPAGE_WELCOME": "Willkommen"
  }
}
```

```ts
const url = './assets/resources.' + culture + '.json';
const resources$ = this.httpClient.get(url).pipe(map(data => Object.assign(new Resources(), data.Resources)));
```

While maintaining the translations in [ResXResourceManager](https://github.com/dotnet/ResXResourceManager), the typescript and json files will be automatically generated or updated.
## String Placeholders
Replacing placeholders with values at runtime is also supported with static type support.

Consider a resource `"MAINPAGE_WELCOME"` with the value `"Welcome $(User)!"`:

The TypeScript generated by [ResXResourceManager](https://github.com/dotnet/ResXResourceManager) will look like this:
```ts
export class Resources {
  private MAINPAGE_WELCOME_TEMPLATE = "Welcome ${User}!";
  MAINPAGE_WELCOME = (args: { User: string }) => {
    return formatString(this.MAINPAGE_WELCOME_TEMPLATE, args);
  }
}
```
so the usage in your code will look like:
```ts
const text = resources.MAINPAGE_WELCOME({ User: 'tom'})
```
Again code completion will support you to write correct code that will not compile if you provide insufficient or wrong formatting parameters.

## Installing ResXResourceManager
You will need at latest version 1.40 of [ResXResourceManager](https://github.com/dotnet/ResXResourceManager). 
If you don't have installed it yet, get the latest version as described [here](https://github.com/dotnet/ResXResourceManager/blob/master/README.md#installation).

The Visual Studio extension is recommended, but if you don't have VisualStudio, you can use the standalone version as well. 
Just note that the standalone version does not support the "Move To Resource" feature.

## Setting up your application
If you start from the scratch, generate a [new application](https://angular.io/cli/generate) and setup the [ngrx store](https://ngrx.io/guide/schematics).

### 1. Integration of ResXResourceManager
To enable integration with ResXResourceManager you will need to add two files to your project:
- the `resx-manager.webexport.config` file in your `scr/` root folder (next to `index.html`). This file configures the locations of the files generated by ResXResourceManager.
- an empty resource file as a starting point. A good place is e.g. in the `l10n/` sub-folder.

You can just copy these two files from [here](./l10nScaffolding)

Now start Visual Studio or standalone ResXResourceManager and open your `src/` folder.
This will trigger the initial creation of the `resources.ts` file in the `app/` folder next to your `app.module.ts`

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
      filter(culture => culture && culture !== 'en'),
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
    const resources = Object.assign(new Resources(), data.Resources);
    return {...state, resources };
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

#### Start localizing
Now that all is set up, you can start localizing your app.
If you use the Visual Studio extension of ResXManager, you can use the 'Move to Resource' feature as shown in the demo video.
When you use the standalone version, you have to manually create your resource entries in ResXManager, but you still have intellisense,
so can't type wrong when using the resources in your .html or .ts code.
