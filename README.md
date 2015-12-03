# webapp

Build webapps with React, Redux, Webpack, GraphQL.
They render on the server and reuse state on the client.
New pages are loaded on the client only.
Code is split into separate chunks per page.
Even Redux Reducers are split.
This allows building arbitrarily huge websites from a single codebase.

## Disclaimer
This is project is a playground which I use to experiment with React, Redux, Webpack, React Router and GraphQL.
I want to build a solid foundation for building arbitrarily big websites which still render fast, are easy to scale, refactor and test.
This project should not be used as the base of any serious application.

## Trying things out

### mongodb
You need to manually install MongoDB.

### running things
Run the following commands to try things out.

```bash
# only the first time
$ npm install # installs all dependencies

# every time you start developing
$ npm run mongo # start the local mongo db

# open a new terminal
$ npm start # this starts the servers (one for api/graphql, one for ssr)
```
