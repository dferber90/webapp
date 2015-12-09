# bugs

List of known bugs

## images are emitted twice
When building for production, images are emitted twice.
We should have a something similar to url-loader which doesn't emit static assets.
It should still return the url of the would-have-been-generated file.
It also needs to inline small images.
