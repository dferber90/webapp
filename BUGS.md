# bugs

List of known bugs


## back button
When navigating to `http://localhost:3000/account/login`, the back button has to be pressed twice to actually go back.
When disabling redux-simple-router it works correctly. Seems to be an issue on their side.
https://github.com/rackt/redux-simple-router/issues/45


## account creation
When creating an account, the password is hashed using sha256.
This hash is stored in the database directly, meaning a leak of the database would allow the attacker to log in as any user.
This is bad. Salts and other stuff should be used.
Maybe even add challenge response authentication?
As logging in is the only thing cookies can be used for and actual header auth is used for other API endpoints, CSRF should not be a security risk.
