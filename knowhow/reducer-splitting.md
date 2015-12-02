# reducer-splitting

## motivation

When an application has got two very decoupled routes, then a huge part of the reducers
is probably only needed for one of the routes. Reducer splitting allows to load
reducers lazily. Component can define a static `reducer` property containing the
reducer. This will replace the current reducer of the store with `store.replaceReducer`.

This way the code splitting which is in place for components anyways can split
the reducers as well! This gives even better load time!

## setup

The uppermost route should define a static called `reducer` containing the
default reducer which was used to create the store. This way the application
can fall back to the default reducer in case none of the components of the current
route define an reducer.

## technical

The `SplitReducer` component takes care of the code splitting.
It uses `match` to get the `renderProps` of the router.
It then reads all components from the current route and collects the `reducer`
that is specified on the innermost component.
Then it calls `store.replaceReducer` to replace the current reducer.

If all components need the same default reducer, then it will end up in the
commons chunk, because it will be defined when initializing the store.
Components can then combine their own reducer with the default reducer using `reduceReducers`.
