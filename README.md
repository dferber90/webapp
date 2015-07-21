# CRS

## Webpack
Running `npm start` starts `webpack/dev.js`. This file loads two Webpack configurations from `webpack/webpack.config.js`.
The first configuration is for the client. The second configuration is for the server.

Next, `dev.js` generates `build/backend.js using Webpack. It is generated from `app/server/server.js`, using Webpack.
The generated file `build/backend.js` is watched for changes using `piping`. This way the server restarts when something is changed.

`dev.js` also builds the files served to the client, using the first Webpack configuration.
The files are generated to `build/assets`. During development, the files are not written to disk. Instead they are served from the WebpackDevServer which is also started in `dev.js`.
The WebpackDevServer watches the used files for changes and recompiles in case a file is edited.
The WebpackDevServer also proxies all requests it cannot fulfill on its own to `localhost:3000`, where
the express-server started in `app/server/server.js` answers them. Therefor, the WebpackDevServer only serves the files Webpack generates for the client.


## Constants
Webpack defines `__DEV__`, `__DEVTOOLS__`, `__CLIENT__` and `__SERVER__`.
If the environment variable `PRODUCTION` is not defined, then `__DEV__` is `true`.
The values of these constants are set in `webpack/webpack.config.js`.
For production releases, Webpack replaces the constants with their actual values and then uses dead-code-elimination to remove dead code blocks.
This way the client will never see code wrapped in a `if (__SERVER__)` block, and vice versa.


## React Router
React Router defines a root route containing all child routes in `app/common/routes/getRootRoute.js`.

### Code Splitting
It also defines split points for the application in `app/common/routes/<route>/index.js`.
Webpack handles async loading of these routes and their components using `requre.ensure`.

Because the server already knows which entry point the client is using, it can send the appropriate file for the initial route.
This happens in `app/common/server/server.js` with `getEntryPointFile()`.

### Redux Router
A React Router component specifically for Redux is registered in `app/common/routes/getRootRouter`.
This will register a `router` property in the store. All route changes also flow through redux.

This component also exposes `store` in the context. That's why this App uses no Redux `<Provider />` component,
because the Provider's job is already done (exposing the store in the context).
The React Router gets the current store passed to it in `getRootRoutes(store)` in `app/common/routes/getRootRoute.js`.

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
The file `webpack/run-bundled-tests.js` is used for `npm test` and for `npm run test-dev`.
This also helps with piping the file (watching for changes) as only one file needs to be watched, instead of watching `build/tests/client.js` and `build/tests/server.js`.

To develop tests run `$ npm run test-dev`. This will continuously watch the tests for changes and rerun them.

Each test file has to be registered either in `tests/client-env/run.js` or `tests/server-env/run.js`.

To get the pure TAP output, use `$ npm -s test`.
This will activate npm's silent mode, where additional information from npm is not printed to the console.
