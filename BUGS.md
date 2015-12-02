# bugs

List of known bugs

## npm start keeps process open

`npm start` runs `concurrent`. When quitting with `CTRL+C` one of the commands
from `concurrent` does not actually stop. Not sure why and not sure what to do
about it.


## server complains about hot module replacement (react)

When saving a file the server complains about duplicate React.
This is due to monkey-hot, but does not seem to affect anything.
