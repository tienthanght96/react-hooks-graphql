import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AppContext } from './context';

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { state } = useContext(AppContext)
  return (
    <Route
      {...rest}
      render={props => {
        return (
          !state.isAuth
          ? <Redirect to="/login" />
          : <Component {...props} />
        )
      }}
    />
  )
}