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

export const setSelectedFlyer = (flyer) => {
    return {
        type: actionTypes.SET_SELECTED_FLYER,
        flyer: flyer
    }
}