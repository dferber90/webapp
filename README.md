# CRS

## Webpack
Running `npm start` starts `webpack/dev.js`. This file loads two Webpack configurations from `webpack/webpack.config.js`.
The first configuration is for the client. The second configuration is for the server.

Next, `dev.js` generates `build/backend.js using Webpack. It is generated from `app/server/main.js`, using Webpack.
The generated file `build/backend.js` is watched for changes using `piping`. This way the server restarts when something is changed.

`dev.js` also builds the files served to the client, using the first Webpack configuration.
The files are generated to `build/assets`. During development, the files are not written to disk. Instead they are served from the WebpackDevServer which is also started in `dev.js`.
The WebpackDevServer watches the used files for changes and recompiles in case a file is edited.
The WebpackDevServer also proxies all requests it cannot fulfill on its own to `localhost:3000`, where
the express-server started in `app/server/main.js` answers them. Therefor, the WebpackDevServer only serves the files Webpack generates for the client.
