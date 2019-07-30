import React from "react";
import { GraphQLClient } from 'graphql-request';
import { GoogleLogin } from 'react-google-login';
import { withStyles } from "@material-ui/core/styles";
// import Typography from "@material-ui/core/Typography";

const ME_QUERY = `
{
  me {
    picture
    _id
    email
    name
  }
}
`

const Login = ({ classes }) => {
  const onSuccess = async googleUser => {
    console.log(googleUser);
    const idToken = googleUser.getAuthResponse().id_token
    console.log('idToken', idToken);
    const client = new GraphQLClient('http://localhost:4000/graphql', {
      headers: {
        authorization: idToken
      }
    })
    const data = await client.request(ME_QUERY)
    console.log('data', data);
  }
  return (
    <div>
      <GoogleLogin
        clientId="1041503383543-upc08nmjc23jdi28877jo62mh5478bku.apps.googleusercontent.com"
        onSuccess={onSuccess}
        isSignedIn={true}
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
