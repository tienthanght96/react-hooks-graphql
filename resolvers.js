const { AuthenticationError } = require('apollo-server')
const user = {
  _id: 1,
  name: "Thang",
  email: 'thangtran@gmail.com',
  picture: ''
}

const authenticated = next => (root, args, context, info) => {
  if(!context.currentUser) {
    throw new AuthenticationError('You must be login')
  }
  return next(root, args, context, info)
} 

module.exports = {
  Query: {
    me: authenticated((root, args, context, info) => context.currentUser)
  }
}