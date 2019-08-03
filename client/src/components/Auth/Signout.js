import React, { useContext } from "react";
import { GoogleLogout } from 'react-google-login';
import { withStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import { AppContext } from "../../context";
import { actionTypes } from "../../reducer";

const Signout = ({ classes }) => {
  
  const { dispatch } = useContext(AppContext)
  
  const onLogoutSuccess = () => {
    dispatch({ type: actionTypes.SIGNOUT_USER })
    console.log('Logout user');
  }

  return (
    <GoogleLogout
      onLogoutSuccess={onLogoutSuccess}
      render={({ onClick }) => (
        <span className={classes.root} onClick={onClick}>
          <Typography variant="body1" className={classes.buttonText}>Signout</Typography>
          <ExitToAppIcon className={classes.buttonIcon}></ExitToAppIcon>
        </span>
      )}
    />
  );
};

const styles = {
  root: {
    cursor: "pointer",
    display: "flex"
  },
  buttonText: {
    color: "orange"
  },
  buttonIcon: {
    marginLeft: "5px",
    color: "orange"
  }
};

export default withStyles(styles)(Signout);
