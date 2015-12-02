# css-modules

## CSS

To use a css-file directly from an npm-module, use `import styles from '~bootstrap/lib/file.css'`.

The style loader will resolve all URLs within the css file itself, so relative paths can be used.
The LESS-loader can convert to css files which in turn uses css-modules.

### CSS modules

Configuration uses the awesome css-modules, which are integrated into webpack directly.
They're available by using the css-loader with `css?modules`:

```js
  { test: /\.css$/, loader: "style!css?modules" },
```

Using the css-loader and the style-loader will result in the styles being placed added to the DOM automatically.
On the server, we only care for the mapping of keys to actual class names, so we don't need style-loader and css-loader.
Instead we parse the css file directly and generate the mappings object from it.
*This fails right now for anything that uses `composes`.*


### unstyled flash

Because css is shipped with JS, the page will be unstyled until all js is loaded
and parsed. Because this includes react and the components, it can take a few seconds.
It needs to load react because the files where the css-modules are loaded are react components.


#### approach 1

It would be possible to simply move the JS into the <head> and load it synchronously.
Then no unstyled flash would happen, but the load-speed benefits of SSR are lost.


#### approach 2

Another approach would be to generate a css-file for each component, collect their
urls before rendering on the server and then inline only these css-files in the head.
This can result in A LOT of http requests because each component could have its own css file.
When new async chunks are loaded, the client needs to load their css-files as well and add them to
the head.
This approach enables caching, avoids flash of unstyled text and only increases
the initial load time by the size of the css. It further doesn't have to wait
until js is parsed.


#### approach 3

Generate one stylesheet per chunk. Load them in the <head>.
Avoids flash of unstyled text. Minimizes HTTP requests. Enables caching.
Could potentially load lots of unused styles.
