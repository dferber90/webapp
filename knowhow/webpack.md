
## CommonsChunkPlugin for Vendor files
Some modules are very unlikely to change and should be moved to their own chunk for caching reasons.
Multiple modules can be moved to the same chunk. But also multiple chunks can be created.
Only one chunk will contain the webpack runtime.

```js
entry: {
  vendor: ['moment'],
  react: ['react', 'react-dom'],
  // ...
},
plugins: {
  new webpack.optimize.CommonsChunkPlugin({
    names: ['react', 'vendor'],
    minChunks: Infinity
  })
}
```

This combination creates two chunks:
- vendor (containg everything required from 'moment') as `react.js`
- react (containg everything required from 'react' and 'react-dom') as `vendor.js`

Because `vendor` is listed last in CommonsChunkPlugin, it will contain the webpack runtime (definition of `webpackJsonp`).
This means `vendor.js` has to be the first script that is included in HTML.

## paths
- `output.path`: where files will be saved
- `output.publicPath`: tell webpack relative path to where files are saved
- devServer: `contentBase`: which directory to serve,
- devServer: `publicPath`: where webpack serves the generated files (should be same as `output.publicPath`),
