# css-modules

## CSS

To use a css-file directly from an npm-module, use `import styles from '~bootstrap/lib/file.css'`.

The style loader will resolve all URLs within the css file itself, so relative paths can be used.
The LESS-loader can convert to css files which in turn uses css-modules.

### CSS modules

Configuration uses the awesome css-modules, which are integrated into webpack directly.
They're available by using the css-loader with `css?modules`:

```js

  # client
  { test: /\.css$/, loader: "style!css?modules" },

  # server
  { test: /\.css$/, loader: "mySecondLoader!css?modules" },
```

Using the css-loader and the style-loader will result in the styles being added to the DOM automatically.
On the server, we only care for the mapping of keys to actual class names, so we don't need style-loader and css-loader.
Instead we parse the css file directly and generate the mappings object from it.
*This fails right now for anything that uses `composes`.*


### flash of unstyled text

Because CSS is shipped with JS, the page will be non-styled until all JS is loaded
and parsed. Because this includes react and the components, it can take a few seconds.
It needs to load react because the files where the css-modules are loaded are react components.

There are several approaches to work around this:

#### approach 1

It would be possible to simply move the JS into the <head> and load it synchronously.
Then no non-styled flash would happen, but the load-speed benefits of SSR are lost.


#### approach 2

Another approach would be to generate a CSS-file for each component, collect their
URLs before rendering on the server and then inline only these CSS-files in the head.
This can result in A LOT of http requests because each component could have its own css file.
When new async chunks are loaded, the client needs to load their CSS-files as well and add them to the head.
This approach enables caching, avoids flash of non-styled text and only increases
the initial load time by the size of the css. It further doesn't have to wait
until JS is parsed.


#### approach 3

Generate one stylesheet per chunk. Load them in the <head>.
Avoids flash of non-styled text. Minimizes HTTP requests. Enables caching.
Could potentially load lots of unused styles.


#### approach 4 (the taken one)
Each component declares its own styles using css modules.
Each component further statically exports its own styles.
On the server, the router matches all components, reads their styles and inlines their css in the head.

- The initial css is loaded twice (if the component exports it; could also not export it)
+ Can use SSR
+ No flash of non-styled text
+ Could use decorator to auto-export css classes

On the server, webpack uses a custom loader after the css-loader which exports the css module names. This way the server can use the css modules just like the client.
Each React component can have its used css module styles as a static property.
On the server, the router matches all rendered components and pulls the style information from them. Afterwards the server renders the initial HTML and inlines the CSS in the HEAD tag. This way the flash of non-styled text is prevented, while the
benefits of SSR are kept.
On the client, the style loader is used as usual, together with the css loader.
When the client has taken over and React is done initializing, it's style loader will add custom style tags to the HEAD. At this point the style information generated on the server can be removed, by removing the style tag form the HEAD.
Because the underlying stylesheets are the same, no flash will happen during that phase.
