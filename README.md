# Webapp Starter Pack
The goal of this project is to provide a base for building modern, huge web apps.

[![Join the chat at https://gitter.im/dferber90/webapp-starter-pack](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dferber90/webapp-starter-pack?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Update
The dependencies of this project are changing quite heavily right now, so keeping up with the ever-changing API's is hard.
I'm waiting for the releases of React Router 1.0, React 0.14, Redux and Redux-React-Router before continuing development.

This project will be adapted then. Lot's of stuff will change in this setup.

## Disclaimer
Please note that this starter-pack is the result of my two-months-and-counting deep dive into React, Redux and Webpack.
It is my attempt to combine all of these technologies, but I am not quite there yet. I published my attempt now so other people building redux examples can borrow ideas.

**This starer-pack attempt is not suitable to be the base of any serious application - at least not yet.**

The `master` branch is changing often and I am committing code that has parts missing or errors from time to time. I will switch to a different strategy once the project is more advanced.

If you are looking for a more mature alternative, you can check out
- [react-redux-universal-hot-example](https://github.com/erikras/react-redux-universal-hot-example)
- [react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit)
- [react-isomorphic-starter-kit](https://github.com/RickWong/react-isomorphic-starterkit)

## Features
**With this setup your app (hopefully)..**
- can [build for production](https://github.com/dferber90/webapp-starter-pack/issues/4#issuecomment-128451373)
- can run tests once for CI (with TAP report)
- can be developed using hot reloading
- can be linted
- is universal
- has code splitting
- has server-side rendering
- has gradual loading (with appropriately split stylesheets)
- uses webpack for the server bundle
- uses webpack for the client bundle and chunks
- enables multiple entry points
- sends correct entry point chunk in initial HTML
- can be tested in server- and client-environments
- uses
  - [React](https://facebook.github.io/react/)
  - [Redux (RC1)](https://github.com/gaearon/redux/tree/v1.0.0-rc)
  - [React Router (Beta3)](http://rackt.github.io/react-router/tags/v1.0.0-beta3.html)
  - [Redux DevTools](https://github.com/gaearon/redux-devtools)
  - ES6 with [Babel](https://babeljs.io/)
  - [ESLint](http://eslint.org/)
  - [webpack](https://github.com/webpack/webpack)
  - [Flux Standard Actions](https://github.com/acdlite/flux-standard-action)

## Wishlist
**This setup misses:**
- data fetching
- database
- rpc
- auth
- optimistic UI
- i18n
- ...

## Installation

```bash
git clone https://github.com/dferber90/webapp-starter-pack.git
cd webapp-starter-pack

npm install
npm start # starts server and client. visit localhost:8080
```

## npm commands

`npm start` to start developing. Visit localhost:8080.

`npm test` runs tests once and reports with TAP and correct exit code.

`npm run test:dev` continuously runs tests for development.

`npm run build` builds for production.

`npm run clean` cleans up build folder.

`npm run lint` lints app code.

`npm run debug:server` Starts server for debugging

`npm run debug:inspector` Opens node-inspector in Browser


## Docs
The docs are not very elaborate. Please open an issue if you have got a question,
need help or in case there is room for improvement.

## Webpack
Running `npm start` starts `webpack/dev.js`. This file loads two Webpack configurations from `webpack/webpack.config.js`.
The first configuration is for the client. The second configuration is for the server.

Next, `dev.js` generates `build/backend.js` from `app/server/server.js` using Webpack.
The generated file `build/backend.js` is watched for changes using `piping`. This way the server restarts when something is changed.

`dev.js` also builds the files served to the client, using the first Webpack configuration.
The files are generated to `build/assets`. During development, the files are not written to disk. Instead they are served from the WebpackDevServer which is also started in `dev.js`.
The WebpackDevServer watches the used files for changes and recompiles in case a file is edited.
The WebpackDevServer also proxies all requests it cannot fulfill on its own to `localhost:3000`, where
the express-server started in `app/server/server.js` answers them. Therefore, the WebpackDevServer only serves the files Webpack generates for the client.

### Webpack Aliases
Webpack is configured with some aliases for often used folders,
so you don't have to provide long relative paths.
You can refer to anything in `app` directly. Instead of `import * from '../app/common'`,
you can do `import * from 'common'`.

See object `resolve` in `webpack/webpack.config.js`. There, the following folders are defined:

```js
var resolve = {
  alias: {
    public: path.join(__dirname, '..', 'public')
  },
  root: [
    path.join(__dirname, '..', 'app')
  ]
}
```

Folders with aliases (alias ⇔ resolved folder):

* common ⇔ app/common
* server ⇔ app/server
* client ⇔ app/client
* public ⇔ public

This allows you to import starting with these paths instead of having long relative paths.
This should make refactoring easier as well, because you don't have to mess with relative paths as much.
You can read more about aliases in webpack [in this issue](https://github.com/webpack/webpack/issues/109) and [in the docs](http://webpack.github.io/docs/configuration.html#resolve).


### Constants
Webpack defines `__DEV__`, `__CLIENT__` and `__SERVER__`.
If the environment variable `PRODUCTION` is not defined, then `__DEV__` is `true`.
The values of these constants are set in `webpack/webpack.config.js`.
For production releases, Webpack replaces the constants with their actual values and then uses dead-code-elimination to remove dead code blocks.
This way the client will never see code wrapped in a `if (__SERVER__)` block, and vice versa.

One example for this is that during development, some variables are exposed to the browser in the playground namespace.
For example you can use type `playground.React` in the browser console to access React.

## React Router
React Router defines a root route containing all child routes in `app/common/routes/rootRoute.js`.

### Code Splitting
It also defines named split points for the application in `app/common/routes/<route>/index.js`.
Webpack handles async loading of these routes and their components using `requre.ensure`.

Because the server already knows which path the client is requesting, it can send the appropriate chunks for the initial route.
This happens in `app/server/util/generatePageHelpers.js` with `getChunksFromPath()`.
To benefit from this, you have to associate new routes with their chunk in this method manually (for now).
The values of the strings in the array returned from `getChunksFromPath` correspond to chunks defined through `require.ensure([], ..fn.., '<chunk name>')`.
Using this method decreases the time it takes for the client-side app to run by around 300ms, more if the RTT is higher on mobile networks.
Even if this method is not used, the app will still be rendered immediately because of SSR.
This is an opt-in performance improvement.

**Important:** Webpack defines *Entry Points* and *Chunks*.

> There is only one Entry Point right now. It is `app.entry.js`. Entry Points are not used for code splitting in this setup.
    You do not have to add new ones.
>
> The splitting of the app into different parts for different routes happens through chunks.
> These chunks are generated as described above (using the route definitions).
> Chunks are also used to split out common functionality, so not every chunks serves routes (eg `commonsChunk.js`).

**Important:** Only one default export, no other exports in routes.

> You specify which component should load for a specific route in `app/common/routes/index.js` using `cb(null, require('./components/<Component>'))`.
> Here `<Component>` is loaded with require, but the file `<Component>.js` defines its exports with ES6 module syntax.
> Therefore, the file `<Component>.js` must have one default export only and no other named exports.
> Otherwise your app will break with `Error: Invariant Violation: ReduxRoute.render(): A valid ReactComponent must be returned. You may have returned undefined, an array or some other invalid object.`.

### Redux Router
A React Router component specifically for Redux is registered in `app/common/routes/rootRouter`.
This will register a `router` property in the store. All route changes also flow through redux.

This component also exposes `store` in the context. That's why this App uses no Redux `<Provider />` component,
because the Provider's job is already done (exposing the store in the context).
The React Router gets the current store passed to it in `getRootRoutes(store)` in `app/common/routes/rootRoute.js`.

Docs: https://github.com/acdlite/redux-react-router

## ESLint
Linting can be run with `npm run lint`.
Rules for ESLint are defined in `.eslintrc`.
Ignored files are set in `.eslintignore`.

In case you have installed `eslint` globally, make sure to also install `eslint-plugin-react` globally.
Otherwise, you will get an error saying `eslint-plugin-react` was not found.

## Redux
[Docs](http://rackt.github.io/redux/index.html)

Action Creator -> Action -> Dispatch(Action) -> Provider -> Connect -> React Component.

## Redux DevTools
Redux has got devtools that enable time traveling. The devtools are rendered on the client only, into a separate div called `react-debug`.
The server does not render the devtools. This way the client does not reuse the markup from the server for the devtools.
But it reuses it for the normal application rendered into `react-app`.

As Redux DevTools uses React 0.13 and this project uses React 0.14, there is a deprecation warning:

```
  Warning: `require("react").findDOMNode` is deprecated. Please use `require("react-dom").findDOMNode` instead.
```


## Testing

### Unit Testing
To run the tests, simply do `$ npm test`. This will generate files for testing with webpack using `webpack/test.js`.
The tests are then build into `/build/tests/client.js` and `/build/tests/server.js`.

**Attention** Tests run with a separate webpack configuration. It is defined in `webpack/test.js`.

There are two separate test files because there are two environments to consider: 1) client and 2) server.
The two entry points are `tests/server-env/run.js` and `tests/client-env/run.js`. These files import their tests. The tests themselves import parts of the app to test.

A helper file called `webpack/run-bundled-tests.js` is used to combine the test output from client and server by requiring both. This way only a single TAP protocol is generated, including the server and the client.
The file `webpack/run-bundled-tests.js` is used for `npm test` and for `npm run test:dev`.
This also helps with piping the file (watching for changes) as only one file needs to be watched, instead of watching `build/tests/client.js` and `build/tests/server.js`.

To develop tests run `$ npm run test:dev`. This will continuously watch the tests for changes and rerun them.

Each test file has to be registered either in `tests/client-env/run.js` or `tests/server-env/run.js`.

To get the pure TAP output, use `$ npm -s test`.
This will activate npm's silent mode, where additional information from npm is not printed to the console.

## Debugging

First, run `npm run debug:server`. This will start the server.
Next, run `npm run debug:inspector`. This will open the node inspector on `http://127.0.0.1:3333/?ws=127.0.0.1:3333&port=5858`.

> Changes to the code will not be reflected while debugging, because piping is disabled during debugging.
>
> *Maybe this restriction can be resolved later on.*
