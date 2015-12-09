# building

Bundling for production with `webpack -p ..` is the same as adding `--optimize-minimize --optimize-occurence-order`.
Instead of using `webpack -p`, one can simply add the modules himself.
Since minification and optimizing occurence (there is only one chunk anyways) is useless when building for the server this step is skipped.
For the client build, the plugins are added to the build configuration, so `-p` should be omitted as well.

## npm
When `npm install` is run while `NODE_ENV` is set to `production`, then the `devDependencies` won't be installed.

## react
When


## server
