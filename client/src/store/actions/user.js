import * as actionTypes from './actionTypes';

export const setRegistered = (bool) => {
    return {
        type: actionTypes.SET_REGISTERED,
        bool: bool      
    }
}