# TODOs
Vague list of things I want to work on.

## Code
* Async stuff in Redux where Routes wait until all Promises are resolved before rendering on server. erikras' example has this working.

## Build Process
* [Extract styles to css files](https://github.com/webpack/extract-text-webpack-plugin), probably in combination with webpack-isomorphic-tools

## Hacks that need better solution
* rehydration of state, SessionComponent, ReducerRegistry
* remove duplicate rendering on client (if possible)

## Explore
* [Ducks](https://github.com/erikras/react-redux-universal-hot-example/blob/master/docs/Ducks.md)
* [Load images isomorphically](https://github.com/halt-hammerzeit/webpack-isomorphic-tools), and also assets

## Features for far future
* Publish Subscribe
* Data on Client (Relay?)
* Relay integration. Use Redux for local state, relay for client/server stuff.
* Optimistic UI with Relay
* [Meta Data](https://github.com/kodyl/react-document-meta)
