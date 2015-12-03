# bugs

List of known bugs

## seamless authentication ignores queries
Right now the seamless authentication ignores queries and uses the path only.
This should be a simple thing to add.


## server complains about hot module replacement (react)

When saving a file the server complains about duplicate React.
This is due to monkey-hot, but does not seem to affect anything.
