const { AuthenticationError } = require('apollo-server')
const Pin = require('./models/Pin')

const authenticated = next => (root, args, context, info) => {
  if(!context.currentUser) {
    throw new AuthenticationError('You must be login')
  }
  return next(root, args, context, info)
} 

module.exports = {
  Query: {
    me: authenticated((root, args, context, info) => context.currentUser)
  },
  Mutation: {
    createPin: authenticated(
      async (root, args, context, info) => {
        try {
          const newPin = await new Pin({
            ...args.input,
            author: context.currentUser
          }).save()
          const pinAdded = await Pin.populate(newPin, 'author')
          return pinAdded
        } catch (error) {
          console.log('Error create pin server', error);
          return error
        }
      }
    )
  }
}