export const ME_QUERY = `
{
  me {
    picture
    _id
    email
    name
  }
}
`

export const GET_PINS_QUERY = `
  {
    getPins {
      _id
      title
      image
      createdAt
      content
      latitude
      longitude
      author {
        _id
        name
        email
        picture
      }
      comments {
        text
        createdAt
        author {
          _id
          name
          picture
        }
      }
    }
  }
`