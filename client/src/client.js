import { useState, useEffect } from 'react';
import { GraphQLClient } from 'graphql-request';

export const BASE_URL =
  process.env.NODE_ENV === 'production'
  ? 'http://localhost:4000/graphql'
  : 'http://localhost:4000/graphql'

export const useClient = () => {
  const [idToken, setIdToken] = useState('')

  useEffect(() => {
    const idToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token
    setIdToken(idToken)
  },[])
  return new GraphQLClient(BASE_URL, {
    headers: {
      authorization: idToken
    }
  })
}