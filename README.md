# webapp

Build webapps with React, Redux, Webpack, GraphQL.
They render on the server and reuse state on the client.
New pages are loaded on the client only.
Code is split into separate chunks per page.
Even Redux Reducers are split.
This allows building arbitrarily huge websites from a single codebase.
This approach is excellent in cases like when you have a large admin interface
and a small frontend, and don't want your regular users have to load all the
admin code.


## mongodb
You need to manually install MongoDB, and run it with `npm run mongo`.
