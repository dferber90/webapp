const mongo = require('promised-mongo')
const { ObjectId } = mongo
/* eslint-disable new-cap */

const db = mongo('mongodb://localhost:27017/app')
const todosCollection = db.collection('todos')
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const normalizeId = doc => {
  doc.id = doc._id
  return doc
}

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
const CustomGraphQLDateType = require('graphql-custom-datetype')
/* eslint-enable no-unused-vars */


// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

const User = new GraphQLObjectType({
  name: 'User',
  description: 'The account of a user',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    userName: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    photo: { type: GraphQLString },
    createdAt: { type: CustomGraphQLDateType },
    emailAddress: { type: new GraphQLNonNull(GraphQLString) },
    emailVerified: { type: new GraphQLNonNull(GraphQLBoolean) },
  }),
})

const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'Single entry submitted by an user',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    url: { type: GraphQLString },
    submittedAt: { type: new GraphQLNonNull(CustomGraphQLDateType) },
    text: { type: GraphQLString },
    author: { type: new GraphQLNonNull(User) },
    upvoters: { type: new GraphQLList(User) },
    upvotes: { type: new GraphQLNonNull(GraphQLInt) },
  }),
})

const Comment = new GraphQLObjectType({
  name: 'Comment',
  description: 'A comment submitted by an user',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    postId: { type: new GraphQLNonNull(GraphQLString) },
    author: { type: new GraphQLNonNull(User) },
    text: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(CustomGraphQLDateType) },
    upvoters: { type: new GraphQLNonNull(new GraphQLList(User)) },
    upvotes: { type: new GraphQLNonNull(GraphQLInt) },
    replyOf: { type: GraphQLString },
  }),
})

const Todo = new GraphQLObjectType({
  name: 'Todo',
  description: 'A todo list item',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    text: { type: new GraphQLNonNull(GraphQLString) },
    checked: { type: new GraphQLNonNull(GraphQLBoolean) },
  }),
})

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
    createUser: {
      type: User,
      args: {
        userName: { type: new GraphQLNonNull(GraphQLString) },
        emailAddress: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (rootValues, args) => {
        if (args.emailAddress.indexOf('@') === -1) {
          throw new Error('invalid-mail')
        }

        return usersCollection.insert({
          userName: args.userName,
          emailAddress: args.emailAddress,
          emailVerified: false,
          createdAt: new Date(),
        })
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
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, args) => {
        return todosCollection.findOne({ id: ObjectId(args.id) })
      },
    },
    users: {
      type: new GraphQLList(User),
      resolve: () => {
        // TODO omit some fields
        return usersCollection
          .find({})
          .toArray()
          .then(res => res.map(normalizeId))
      },
    },
    user: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, args) => {
        // TODO omit some fields
        return usersCollection
          .findOne({ _id: ObjectId(args.id) })
          .then(normalizeId)
      },
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: () => {},
    },
    post: {
      type: Post,
      resolve: () => {},
    },
    comments: {
      type: new GraphQLList(Comment),
      resolve: () => {},
    },
    comment: {
      type: Comment,
      resolve: () => {},
    },
  }),
})

// The Schema
const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
})

module.exports = Schema
