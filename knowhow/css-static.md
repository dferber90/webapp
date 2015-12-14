## static css

There is some css that will not go through modules mode and be inlined by the server directly.
For example `normalize.css` will simply be added to the `head` as it is not used anywhere else.
The client never needs to know about it. The server is responsible for creating the CSS file in the output bundle.
The server must therefor also minify it and server it (while in development).

TODO: write a loader which minifies the CSS (can use uglify)
