import * as actionTypes from './actionTypes';

export const setIpLocation = (ipLocation) => {
    return {
        type: actionTypes.SET_IP_LOCATION,
        ipLocation: ipLocation
    }
}