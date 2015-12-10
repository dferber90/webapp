# building

Bundling for production with `webpack -p ..` is the same as adding `--optimize-minimize --optimize-occurence-order`.
Instead of using `webpack -p`, one can simply add the modules himself.
Since minification and optimizing occurrence (there is only one chunk anyways) is useless when building for the server this step is skipped.
For the client build, the plugins are added to the build configuration, so `-p` should be omitted as well.

## npm
When `npm install` is run while `NODE_ENV` is set to `production`, then the `devDependencies` won't be installed.

## react
When


## server


## using the build

### main server
1) copy everything in `build/main/` to a new folder
2) set node-env to `production` by running `export NODE_ENV=production`
3) install dependencies by running `npm install` (because NODE_ENV is production, `devDependencies` won't be installed)
4) run app with `node server.js`

### api server
1) copy everything in `build/api/` to a new folder
2) set node-env to `production` by running `export NODE_ENV=production`
3) install dependencies by running `npm install` (because NODE_ENV is production, `devDependencies` won't be installed)
4) run api-server with `node server-api.js`
