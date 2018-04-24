import * as actionTypes from './actionTypes';

export const setIpLocation = (ipLocation) => {
    return {
        type: actionTypes.SET_IP_LOCATION,
        ipLocation: ipLocation
    }
}

export const setValidPlace = (bool) => {
    return {
        type: actionTypes.SET_VALID_PLACE,
        bool: bool
    }
}