import React, { useContext } from "react";
import { GraphQLClient } from 'graphql-request';
import { GoogleLogin } from 'react-google-login';
import { withStyles } from "@material-ui/core/styles";
import { AppContext } from "../../context";
import { actionTypes } from "../../reducer";
import Typography from "@material-ui/core/Typography";
import { ME_QUERY } from "../../graphql/queries";
import { BASE_URL } from "../../client";

const Login = ({ classes }) => {

  const { dispatch } = useContext(AppContext)
  
  const onSuccess = async googleUser => {
    try {
      console.log(googleUser);
      const idToken = googleUser.getAuthResponse().id_token
      const client = new GraphQLClient(BASE_URL, {
        headers: {
          authorization: idToken
        }
      })
      const { me } = await client.request(ME_QUERY)
      dispatch({ type: actionTypes.LOGIN_USER, payload: me })
      dispatch({ type: actionTypes.IS_LOGGED_IN, payload: googleUser.isSignedIn() })
    } catch (error) {
      onFailure(error)
    }
  }

  const onFailure = error => {
    console.log(`Error login ${error}`)
  }

  return (
    <div className={classes.root}>
      <Typography component="h1" variant="h3" gutterBottom noWrap style={{ color: 'rgb(66, 133, 244)' }}>
        Welcome
      </Typography>
      <GoogleLogin
        clientId="1041503383543-upc08nmjc23jdi28877jo62mh5478bku.apps.googleusercontent.com"
        onSuccess={onSuccess}
        onFailure={onFailure}
        isSignedIn={true}
        theme="dark"
        buttonText="Login with Google"
      />
    </div>
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
