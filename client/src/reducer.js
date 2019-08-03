export const actionTypes = {
  IS_LOGGED_IN: 'IS_LOGGED_IN',
  LOGIN_USER: 'LOGIN_USER',
  SIGNOUT_USER: 'SIGNOUT_USER',
  CREATE_DRAFT: 'CREATE_DRAFT',
  UPDATE_DRAFT_LOCATION: 'UPDATE_DRAFT_LOCATION'
}

export function reducer(state, { type, payload }) {
  switch (type) {
    case actionTypes.LOGIN_USER:
      return Object.assign({}, state, { currentUser: payload })
    case actionTypes.IS_LOGGED_IN:
      return Object.assign({}, state, { isAuth: payload })
    case actionTypes.SIGNOUT_USER:
      return Object.assign({}, state, { currentUser: null, isAuth: false })
    case actionTypes.CREATE_DRAFT:
      return Object.assign({}, state, { draft: { latitude: 0, longitude: 0 } })
    case actionTypes.UPDATE_DRAFT_LOCATION:
      return Object.assign({}, state, { draft: payload })
    default:
      return state
  }
}