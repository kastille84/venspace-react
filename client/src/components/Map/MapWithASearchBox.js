/* eslint-disable no-undef */
import React from 'react';
import _ from "lodash";
import { compose, withProps, lifecycle } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import  SearchBox from "react-google-maps/lib/components/places/SearchBox";
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import classes from './Map.css';

const MapWithASearchBox = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyB_uJWRCI0GpbqK9qSMlpvcgB_Fs6npBsA&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        bounds: null,
        center: {
          lat: this.props.locationRedux.ipLocation.lat, 
          lng: this.props.locationRedux.ipLocation.lng
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          })
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          console.log('places', places);
          // ******* Check Validity of Place
          checkPlaceValidity(places, this.props);
          // ******* Set selected place
          const selectedPlace = {
              placeId: places[0].place_id,
              formatted_address: places[0].formatted_address,
              name: places[0].name
          }

          this.props.onSetSelectedPlace(selectedPlace);
          


          const bounds = new google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
          // refs.map.fitBounds(bounds);
        },        
      })
    }
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={12}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
    className={classes.Map}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Search Flyer By Location"
        className={classes.Input}
      />
    </SearchBox>
    {props.markers.map((marker, index) =>
      <Marker key={index} position={marker.position} />
    )}
  </GoogleMap>
);

const checkPlaceValidity = (places, props) => {
    let foundStreetNumber = false;
    for (let c of places[0].address_components) {
        if (c.types[0] === 'street_number') {
            foundStreetNumber = true;
        }
    }

    if (foundStreetNumber) {
        // set validPlace on locationRedux ot true
        props.onSetValidPlace(true);
    } else {
        props.onSetValidPlace(false);
    }
}



const mapStateToProps = (state) => {
    return {
        locationRedux: state.locationRedux,
        userRedux: state.userRedux,
        flyerRedux: state.flyerRedux
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onSetValidPlace: (bool) => dispatch(actions.setValidPlace(bool)),
        onSetSelectedPlace: (place) => dispatch(actions.setSelectedPlace(place))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MapWithASearchBox);