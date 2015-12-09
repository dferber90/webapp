const mongo = require('promised-mongo')
const { ObjectId } = mongo
/* eslint-disable new-cap */

const db = mongo('mongodb://localhost:27017/app')
// const authorsCollection = db.collection('authors')
const todosCollection = db.collection('todos')

/* eslint-disable no-unused-vars */
const {
  // These are the basic GraphQL types
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLEnumType,

  // This is used to create required fields and arguments
  GraphQLNonNull,

  // This is the class we need to create the schema
  GraphQLSchema,
} = require('graphql')
/* eslint-enable no-unused-vars */


// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

const Todo = new GraphQLObjectType({
  name: 'Todo',
  description: 'A todo list item',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    text: { type: new GraphQLNonNull(GraphQLString) },
    checked: { type: new GraphQLNonNull(GraphQLBoolean) },
  }),
})


// const Author = new GraphQLObjectType({
//   name: 'Author',
//   description: 'Author of a Post (or a comment)',
//   fields: () => ({
//     _id: { type: new GraphQLNonNull(GraphQLString) },
//     name: { type: GraphQLString },
//   }),
// })
//
// const Post = new GraphQLObjectType({
//   name: 'Post',
//   description: 'A Post in the Blog',
//   fields: () => ({
//     _id: { type: new GraphQLNonNull(GraphQLString)},
//     title: {
//       type: new GraphQLNonNull(GraphQLString),
//       resolve: (post) => post.title || 'default title',
//     },
//     content: { type: GraphQLString},
//     author: {
//       type: Author,
//       resolve: (post) => AuthorsList.find(author => author._id === post.author),
//     },
//   }),
// })


// ----------------------------------------------------------------------------
// Mutations
// ----------------------------------------------------------------------------

const Mutation = new GraphQLObjectType({
  name: 'AppMutations',
  description: 'Mutations of the app',
  fields: () => ({
    // createPost: {
    //   type: Post,
    //   args: {
    //     title: { type: new GraphQLNonNull(GraphQLString) },
    //     content: { type: new GraphQLNonNull(GraphQLString) },
    //   },
    //   resolve: (source, args) => {
    //     const post = {
    //       _id: `${Date.now()}::${Math.ceil(Math.random() * 9999999)}`,
    //       author: 'Dominik',
    //       ...args,
    //     }
    //     PostsList.push(post)
    //     return post
    //   },
    // },
    // createAuthor: {
    //   type: Author,
    //   args: {
    //     _id: { type: new GraphQLNonNull(GraphQLString) },
    //     name: { type: new GraphQLNonNull(GraphQLString) },
    //     twitterHandle: { type: GraphQLString },
    //   },
    //   resolve: (rootValues, args) => {
    //     const author = { ...args }
    //     return authorsCollection.insert(author).then(() => author)
    //   },
    // },
    addTodo: {
      type: Todo,
      args: {
        text: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (rootValues, args) => {
        const todo = { text: args.text, checked: false }
        return todosCollection.insert(todo)
      },
    },
  }),
})

// This is the Root Query
const Query = new GraphQLObjectType({
  name: 'AppQueries',
  description: 'Queries of the app',
  fields: () => ({
    echo: {
      type: GraphQLString,
      description: 'Echo what you enter',
      args: {
        message: { type: new GraphQLNonNull(GraphQLString), description: 'What to echo' },
      },
      resolve: (source, { message }, { rootValue: { isAuthenticated, userId } }) => {
        return isAuthenticated ? `you are authentiacted as ${userId} (${message})` : `received: ${message}`
      },
    },
    checkAuth: {
      type: GraphQLString,
      description: 'Your authentication status for test purposes',
      args: {},
      resolve: (source, args, { rootValue: { isAuthenticated } }) => {
        return isAuthenticated ? 'authenticated' : 'not-authenticated'
      },
    },
    todos: {
      type: new GraphQLList(Todo),
      resolve: () => {
        return todosCollection.find({}).toArray()
      },
    },
    todo: {
      type: Todo,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, args) => {
        return todosCollection.findOne({ _id: ObjectId(args._id) })
      },
    },
    // posts: {
    //   type: new GraphQLList(Post),
    //   resolve: () => PostsList, // dummy data
    // },
    // post: {
    //   type: Post,
    //   args: {
    //     id: { type: new GraphQLNonNull(GraphQLString) },
    //   },
    //   resolve: (post, args) => {
    //     return PostsList.find((p) => p._id === args.id)
    //   },
    // },
    // authors: {
    //   type: new GraphQLList(Author),
    //   resolve: (rootValue, args, info) => {
    //     const fields = {}
    //     const fieldASTs = info.fieldASTs
    //     fieldASTs[0].selectionSet.selections.map(selection => {
    //       fields[selection.name.value] = 1
    //     })
    //     return authorsCollection.find({}, fields).toArray()
    //   },
    // },
  }),
})

// The Schema
const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
})

module.exports = Schema
