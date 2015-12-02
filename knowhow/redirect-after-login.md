# redirect after login

When a user is logged out and visits a route which requires authentication,
he will be redirected to the login route.
After the user logs in there, he should be redirected to the page he visited originally.

There are two scenarios how this can happen, depending on when the authenticated route is accessed:

## client browses to authenticated route
When the client initially loaded the app, he didn't use an authenticated route.
The server rendered the app like usual. Now the client browses to an authenticated route.
The client-side router redirects to the login form using the `onEnter` handler from react-router.
It further stores the original route's url in the redux store (as `auth.redirectLocation`).
When the user logged in successfully, the `auth.redirectLocation` is read form the store.
If it exists, the user is redirected to that location.

## authenticated route is requested form server
When the client requests an authenticated route from the server, the server
will generate an HTTP response containing a 302 redirect to the login form.
The server will further set a cookie (for this session only) on the client using the HTTP headers of the response.
The cookie contains the originally requested url.

Now the client's browser makes a second HTTP request (because of the 302) to load the login form.
This time the HTTP request will contain the cookie we set previously, telling the server the original route.
Before the server renders the app, it populates the original route to the store, again under `auth.redirectLocation`.
When the client fills out the login form, the `auth.redirectLocation` will be respected like before.

To prevent later login attempts from redirecting, the cookie is cleared whenever the app is rendered.


This technique enables minimal interruption of the user no matter where he logs in from.
