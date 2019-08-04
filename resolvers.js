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
    me: authenticated((root, args, context, info) => context.currentUser),
    getPins: async (root, args, context, info) => {
      const pins = await Pin.find({}).populate('author').populate('comments.author')
      return pins
    },
  },
  Mutation: {
    createPin: authenticated(
      async (root, args, context) => {
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
    ),
    deletePin: authenticated(
      async (root, args, context) => {
        try {
          const pinDeleted = await Pin.findOneAndDelete({ _id: args.pinId }).exec()
          return pinDeleted
        } catch (error) {
          return null
        }
      }
    ),
    createComment: authenticated(
      async (root, args, context) => {
        try {
          const newComment = { text: args.text, author: context.currentUser._id }
          const pinUpdated = Pin.findOneAndUpdate(
            { _id: args.pinId },
            { $push: { comments: newComment } },
            { new: true }
          )
            .populate('author')
            .populate('comments.author')
          return pinUpdated
        } catch (error) {
          return null
        }
      }
    ),
  },
}