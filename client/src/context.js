import { createContext } from 'react'

export const AppContext = createContext({
  currentUser: null,
  isAuth: false,
  draft: null,
})