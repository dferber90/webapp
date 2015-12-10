# want

## service workers

https://www.youtube.com/watch?v=jCKZDTtUA2A
doesn't seem that hard :)


## testing with reagent

https://github.com/airbnb/reagent
has been renamed to enzyme
https://github.com/airbnb/enzyme


## rethinkDB

Has live updates out of the box. Maybe that is awesome?
https://www.rethinkdb.com/


## redux effects

There is a library out there which seems similar to what we are doing with
middleware. https://github.com/redux-effects/redux-effects


## fsa redux-simple-router

The FSA middleware currently makes an exception for redux-simple-router.
Remove this again once redux-simple-router uses FSA-compliant actions.


## http codes

use correct http codes in responses from server.
There are examples on how to do it:
- https://github.com/jlongster/blog
- http://jlongster.com/A-Simple-Way-to-Route-with-Redux


## Webpack S3Plugin

Automatically upload generated assets (js, css, images) to Amazon S3
(Only for production builds)
https://github.com/MikaAK/s3-plugin-webpack


## components describe their data needs

app collects the needs and fulfills them.
the strategy used to fulfill them can be different on client and server.
it can use caches.


## something similar to combineReducer without the warnings for undefined state

This is needed for the reducer splitting we are using.
Also improves performance.
So, just clone the original and remove the warnings.
Then publish it and the component for reducer splitting as its own module
to npm.
https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch?series=getting-started-with-redux


## deep-freeze for tests

Add deep-freeze in tests to make sure reducers don't change state
https://egghead.io/lessons/javascript-redux-avoiding-array-mutations-with-concat-slice-and-spread?series=getting-started-with-redux


## unit tests for api server


## do not compile supported es6 down to es5 for the server

since we have node 4.0.0 or newer, adapt babel to not transpile unnecessarily.


## move entry points to folder `modules/entry-points`

organize things a bit more


## reselect to select from state

https://github.com/rackt/reselect


## more redux monitors

Add dockable monitor once the problems in redux-devtools with react 0.14 are resolved.
https://github.com/gaearon/redux-devtools-dock-monitor


## redux-form

Use redux-form for all of our forms.
Start with implementing the login with redux-form.
[example][http://erikras.github.io/redux-form/#/examples/submit-validation?_k=0tq18z]


## trarnsport-layer-unaware api

Requests can come in using REST or WebSockets or directly issued on server,
are then transformed into single format and results are sent using another transform.
We could pass in different redux middleware, and instead of making API calls, we dispatch actions.
The middleware picks the actions, makes the calls (via WebSockets, or fetch) and dispatches further actions with the results.
This way it doesn't matter which transport is being used. The app always simply dispatches actions and expects the middleware to fulfill them.
Middleware itself can always be the same, that is generated with an Adapter passed in (which handles communicating over WebSockets or REST). On server, pass in REST, on client pass in WebSockets adapter... maybe.

This way the server could talk to the database directly.
Not sure about this. API would have to be the exact same thing so it works
during SSR or on client. So when creating the app, such a client would have to be
passed in.


## mongoose models

Setting up mongoose in the api
https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
Node Example
http://code.runnable.com/U0MpcpIzdaRkX2VH/querying-mongodb-from-express-using-mongoose-for-node-js
Documentation on Joins, model methods etc
https://github.com/Automattic/mongoose


## realm

React + Elm = realm
This looks amazing for components that have pseudo-local state (state from global
atom managed by one component only, with own actions => no need to write reducers for simple stuff).

- https://github.com/acdlite/realm/
- https://github.com/acdlite/realm-redux


## Hashing of individual chunks by adding `[chunkhash]` to filename

Use http://webpack.github.io/docs/long-term-caching.html.
Option 2 is not supported in combination with Hot Code Replacement!!
Maybe work around it? Use it only for production config?
Server needs to be able to deal with both!
-> Read filename from stats http://webpack.github.io/docs/long-term-caching.html#get-filenames-from-stats

Use `assetsByChunkName`. That solves it!
-> Use no hashing in development
-> Use hashing in production
-> Always read from `assetsByChunkName`, no matter whether dev or prod.
-> Always uses correct filename!


# Done

## ✓ css modules

Right now the server struggles with the loader for css (using custom myLoader).
Replace that loader with one that actually works.


## ✓ reuse json web token

save JOSN web token in localStorage and reuse.
save as cookie as well for SSR. client ---cookie---> server ---header---> api-server
api-server only needs to accept from header.


## ✓ React Transform (not possible yet because Babel 6)

https://github.com/gaearon/babel-plugin-react-transform/issues/46

Until that is finished, we are using react-hot-loader.
When enabling react-transform it needs to be disabled in production and for the
api server. To disable it for production builds `.babelrc` can have
different environments in it, reading from BABEL_ENV or NODE_ENV.
These need to be specified before building and then it should be fine.
-> https://babeljs.io/docs/usage/babelrc/


## ✓ files on server (copy static assets only once)

Also, the server copies all files to get their urls using the `file-loader` or `url-loader` (not sure which is which).
The client has already copied them, so we could simply use the urls.
No need to copy twice. Add custom loaders for these types that return the url without actually copying the file.


## ✓ plop

Custom scaffolding for own routes, components, reducers, action creators..
https://www.npmjs.com/package/plop
