export const actionTypes = {
  IS_LOGGED_IN: 'IS_LOGGED_IN',
  LOGIN_USER: 'LOGIN_USER',
  SIGNOUT_USER: 'SIGNOUT_USER',
  CREATE_DRAFT: 'CREATE_DRAFT',
  UPDATE_DRAFT_LOCATION: 'UPDATE_DRAFT_LOCATION',
  DELETE_DRARFT: 'DELETE_DRARFT',
  GET_PINS: 'GET_PINS',
  CREATE_PIN: 'CREATE_PIN',
  SET_PIN: 'SET_PIN',
  DELETE_PIN: 'DELETE_PIN',
  CREATE_COMMENT: 'CREATE_COMMENT'
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
      return Object.assign({}, state, { draft: { latitude: 0, longitude: 0 }, currentPin: null })
    case actionTypes.UPDATE_DRAFT_LOCATION:
      return Object.assign({}, state, { draft: payload })
    case actionTypes.DELETE_DRARFT:
      return Object.assign({}, state, { draft: null })
    case actionTypes.GET_PINS:
      return Object.assign({}, state, { pins: payload })
    case actionTypes.CREATE_PIN:
      const newPin = payload
      const prevPins = state.pins.filter(pin => pin._id !== newPin._id)
      return Object.assign({}, state, { pins: [...prevPins, newPin] })
    case actionTypes.SET_PIN:
      return Object.assign({}, state, { currentPin: payload, draft: null })
    case actionTypes.DELETE_PIN:
      const deletedPin = payload
      const newPins = state.pins.filter(pin => pin._id !== deletedPin._id)
      return Object.assign({}, state, { pins: newPins, currentPin: null })
    case actionTypes.CREATE_COMMENT:
      const updatedCurrentPin = payload
      const updatedPins = state.pins.map(pin => (pin._id === updatedCurrentPin.id ? updatedCurrentPin : pin))
      return Object.assign({}, state, { pins: updatedPins, currentPin: updatedCurrentPin })
    default:
      return state
  }
}