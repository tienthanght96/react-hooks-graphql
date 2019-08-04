import React, { useState, useContext } from "react";
import axios from 'axios';
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import { AppContext } from "../../context";
import { actionTypes } from "../../reducer";
import { CREATE_PIN_MUTATION } from "../../graphql/mutations";
import { useClient } from "../../client";


const CreatePin = ({ classes }) => {
  const client = useClient()

  const [ title, setTitle ] = useState("")
  const [ image, setImage ] = useState("")
  const [ content, setContent ] = useState("")
  const [requesting, setRequesting] = useState(false)
  const { state, dispatch } = useContext(AppContext)

  const handleDeleteDraft = () => {
    setTitle('')
    setImage('')
    setContent('')
    dispatch({ type: actionTypes.DELETE_DRARFT })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setRequesting(true)
    try {
      const url = await handleImageUpload()
      const { latitude, longitude } = state.draft
      const variables = {
        title,
        content,
        image: url,
        latitude,
        longitude
      }
      const { createPin } = await client.request(CREATE_PIN_MUTATION , variables)
      dispatch({ type: actionTypes.CREATE_PIN, payload: createPin })
      console.log({ createPin });
      setRequesting(false)
      handleDeleteDraft()
    } catch (error) {
      console.error('Error create pin', {error})
      setRequesting(false)
    }
  }

  const handleImageUpload = async () => {
    const formData = new FormData()
    formData.append('file', image)
    formData.append('upload_preset', 'geopins')
    formData.append('cloud_name', 'thangtran')
    const API_BASE = 'https://api.cloudinary.com/v1_1/thangtran/image/upload'
    const { data } = await axios.post(API_BASE, formData)
    return data.url
  }
  
  return (
    <form className={classes.form}>
      <Typography className={classes.alignCenter} component="h2" variant="h4" color="secondary">
        <LandscapeIcon className={classes.iconLarge}/>
        Pin Location
      </Typography>
      <div>
        <TextField
          name="title"
          label="Title"
          placeholder="Insert pin title"
          onChange={event => setTitle(event.target.value)}
        />
        <input
          accept="image/*"
          id="image"
          type="file"
          className={classes.input}
          onChange={event => setImage(event.target.files[0])}
        />
        <label htmlFor="image">
          <Button
            component="span"
            size="small"
            className={classes.button}
            style={{ color: image ? 'green' : '' }}
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          name="content"
          label="Content"
          multiline rows="6"
          margin="normal"
          fullWidth variant="outlined"
          onChange={event => setContent(event.target.value)}
        />
      </div>
      <div>
        <Button className={classes.button} variant="contained" color="primary" onClick={handleDeleteDraft}>
          <ClearIcon className={classes.leftIcon} />
          Discard
        </Button>
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="secondary"
          disabled={!title.trim() || !content.trim() || !image || requesting}
          onClick={handleSubmit}
        >
          Submit
          <SaveIcon className={classes.rightIcon} />
        </Button>
      </div>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
