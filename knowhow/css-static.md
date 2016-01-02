## static css

There is some css that will not go through modules mode and be inlined by the server directly.
For example `normalize.css` will simply be added to the `head` as it is not used anywhere else.
The client never needs to know about it. The server is responsible for creating the CSS file in the output bundle.
The server must therefore also minify it and server it (while in development).
That's why the server checks for the existence of files in `assets/` before consulting the proxy (in development mode).

TODO: write a loader which minifies the CSS (can use uglify)
