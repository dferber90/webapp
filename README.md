# Webapp Starter Pack
The goal of this project is to provide a base for building modern, huge web apps.

## Disclaimer
Please note that this starter-pack was the result of my two-month dive into React, Redux and Webpack.
It is my attempt to combine all of these technologies, but I am not quite there yet.
This starer-pack attempt is not suitable to be the base of any serious application - at least not yet.
I published my attempt now so other people building redux examples can borrow ideas.

I am also not going to continue work on this starter-pack in the near time, as I have discovered the current disadvantages of this approach to building web apps.
But I hope to come back to Redux, Webpack and maybe GraphQL when patterns have settled and stuff has actually hit 1.0 :-)

If you are looking for a more mature alternative, you should check out [react-isomorphic-starter-kit](https://github.com/RickWong/react-isomorphic-starterkit) by @Rygu.

## Features
**With this setup your app..**
- can [build for production](https://github.com/dferber90/webapp-starter-pack/issues/4#issuecomment-128451373)
- can run tests once for CI (with TAP report)
- can be developed using hot reloading
- can be linted
- is universal
- has code splitting
- has server-side rendering
- has gradual loading (with appropriately splitted stylesheets)
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

See object `aliases` in `webpack/webpack.config.js`. There, the following folders are defined:

```js
var aliases = {
  app: path.join(__dirname, '..', 'app'),
  client: path.join(__dirname, '..', 'app', 'client'),
  common: path.join(__dirname, '..', 'app', 'common'),
  server: path.join(__dirname, '..', 'app', 'server'),
  public: path.join(__dirname, '..', 'public')
}
```

For example, you can now just `import * from 'common/<some path>'` anywhere in your app.
`common` will be resolved to `app/common`.

This allows you to import starting with these paths instead of having long relative paths.
This should make refactoring easier as well, because you don't have to mess with relative paths as much.
You can read more about aliases in webpack [here](https://github.com/webpack/webpack/issues/109).


## Constants
Webpack defines `__DEV__`, `__DEVTOOLS__`, `__CLIENT__` and `__SERVER__`.
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

Because the server already knows which path the client is requesting, it can send the appropriate chunk for the initial route.
This happens in `app/common/server/server.js` with `getChunkFile()`.
To benefit from this, you have to associate new routes with their chunk in this method manually (for now).

**Important:** Webpack defines *Entry Points* and *Chunks*.

    There is only one Entry Point right now. It is `app.entry.js`. Entry Points are not used for code splitting in this setup.
    You do not have to add new ones.

    The splitting of the app into different parts for different routes happens through chunks.
    These chunks are generated as described above (using the route definitions).
    Chunks are also used to split out common functionality, so not every chunks serves routes (eg `commonsChunk.js`).

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
To run the tests, simply do `$ npm test`. This will generate files for testing with webpack using `webpack/test.js`.
The tests are then build into `/build/tests/client.js` and `/build/tests/server.js`.
There are two separate test files because there are two environments to consider: 1) client and 2) server.
The two entry points are `tests/server-env/run.js` and `tests/client-env/run.js`. These files import their tests. The tests themselves import parts of the app to test.

A helper file called `webpack/run-bundled-tests.js` is used to combine the test output from client and server by requiring both. This way only a single TAP protocol is generated, including the server and the client.
The file `webpack/run-bundled-tests.js` is used for `npm test` and for `npm run test:dev`.
This also helps with piping the file (watching for changes) as only one file needs to be watched, instead of watching `build/tests/client.js` and `build/tests/server.js`.

To develop tests run `$ npm run test:dev`. This will continuously watch the tests for changes and rerun them.

Each test file has to be registered either in `tests/client-env/run.js` or `tests/server-env/run.js`.

To get the pure TAP output, use `$ npm -s test`.
This will activate npm's silent mode, where additional information from npm is not printed to the console.
