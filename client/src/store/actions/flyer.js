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

export const setNewFlyer = (newFlyer) => {
    return {
        type: actionTypes.SET_NEW_FLYER,
        newFlyer: newFlyer
    }
}

export const removeFlyer = (flyerId) => {
    return {
        type: actionTypes.REMOVE_FLYER,
        flyerId: flyerId
    }
}

export const setDeletedFlyer = (bool) => {
    return {
        type: actionTypes.SET_DELETED_FLYER,
        bool: bool
    }
}