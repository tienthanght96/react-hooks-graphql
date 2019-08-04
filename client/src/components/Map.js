import React, { useState, useEffect, useContext } from "react";
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';
import { withStyles } from "@material-ui/core/styles";
import { differenceInMinutes } from 'date-fns';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

import PinIcon from './PinIcon';
import Blog from './Blog';
import { AppContext } from "../context";
import { actionTypes } from "../reducer";
import { useClient } from "../client";
import { GET_PINS_QUERY } from "../graphql/queries";
import { DELETE_PIN_MUTATION } from "../graphql/mutations";

const INTITIAL_VIEWPORT = {
  latitude: 10.815370,
  longitude: 106.675773,
  zoom: 13,
} 

const Map = ({ classes }) => {
  const client = useClient()
  const [viewport, setViewport] = useState(INTITIAL_VIEWPORT)
  const [userPosition, setUserPosition] = useState(null)
  const [popup, setPopup] = useState(null) 
  const { state, dispatch } = useContext(AppContext)

  useEffect(() => {
    getUserPosition()
  }, [])

  useEffect(() => {
    getPins()
  }, [])

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY)
    console.log({ getPins });
    dispatch({ type: actionTypes.GET_PINS, payload: getPins })
  }

  const getUserPosition = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords
        setViewport({ ...viewport, latitude, longitude })
        setUserPosition({ latitude, longitude })
      },
      error => {}
    )
  }

  const onViewportChange = viewState => {
    setViewport(viewState)
  }

  const onClickMap = event => {
    const { lngLat, leftButton } = event
    if(!leftButton) return

    if(!state.draft) {
      dispatch({ type: actionTypes.CREATE_DRAFT })
    }

    const [longitude, latitude] = lngLat
    dispatch({ type: actionTypes.UPDATE_DRAFT_LOCATION, payload: { longitude, latitude } })

  }

  const hightlightNewPin = (pin) => {
    const isNewPin = differenceInMinutes(Date.now(), Number(pin.createdAt)) < 30
    
    return isNewPin ? 'limegreen' : 'darkblue'
  }

  const handleSelectPin = (pin) => {
    setPopup(pin)
    dispatch({ type: actionTypes.SET_PIN, payload: pin })
  }

  const handleDeletePin = async () => {
    try {
      const variables = { pinId: popup._id }
      const { deletePin } = await client.request(DELETE_PIN_MUTATION, variables)
      dispatch({ type: actionTypes.DELETE_PIN, payload: deletePin })
      setPopup(null)
    } catch (error) {
      
    }
  }

  const isAuthUser = () => {
    return state.currentUser._id === popup.author._id
  }

  return (
    <div className={classes.root}>
      <ReactMapGL
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoidGhhbmd0cmFuY29kZSIsImEiOiJjanl2ZTI4dmIwMWZxM21teG5pc3o0Y2EyIn0.9EW5KrDuVwgZxFHPm575Ig"
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        onViewportChange={onViewportChange}
        onClick={onClickMap}
      >
        {/* NavigationControl */}
        <div className={classes.navigationControl}>
          <NavigationControl onViewportChange={onViewportChange}/>
        </div>
        {/* Pin for user current position */}
        { userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="red"/>
          </Marker>
        )}
        {/* Draft Pin */}
        {
          state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="hotpink"/>
          </Marker>
        )}
        {/* Created Pins */}
        {
          state.pins.map(pin => (
            <Marker
              key={pin._id}
              latitude={pin.latitude}
              longitude={pin.longitude}
              offsetLeft={-19}
              offsetTop={-37}
            >
              <PinIcon
                size={40}
                color={hightlightNewPin(pin)}
                onClick={() => handleSelectPin(pin)}
              />
            </Marker>
          ))
        }

        {/* Popup Dialog */}
        { popup && (
            <Popup
              anchor="top"
              latitude={popup.latitude}
              longitude={popup.longitude}
              closeOnClick={false}
              onClose={() => setPopup(null)}
            >
              <img className={classes.popupImage} src={popup.image} alt={popup.title}/>
              <div className={classes.popupTab}>
                <Typography>
                  {popup.latitude.toFixed(6)},
                  {popup.longitude.toFixed(6)},
                </Typography>
                { isAuthUser() && (
                    <Button onClick={handleDeletePin}>
                      <DeleteIcon className={classes.deleteIcon} />
                    </Button>
                )}
              </div>
            </Popup>
        )}
      </ReactMapGL>
      {/* Blog Area to add Pin Content */}
      <Blog />
    </div>
  );
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
