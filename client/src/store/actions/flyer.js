import * as actionTypes from './actionTypes';

export const setFlyerMade = (bool) => {
    return {
        type: actionTypes.SET_FLYER_MADE,
        bool: bool
    }
}

export const setFlyers = (flyers) => {
    return {
        type: actionTypes.SET_FLYERS,
        flyers: flyers
    }
}