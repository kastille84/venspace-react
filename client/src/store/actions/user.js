import * as actionTypes from './actionTypes';

export const setRegistered = (bool) => {
    return {
        type: actionTypes.SET_REGISTERED,
        bool: bool      
    }
}

export const setSignin = (bool) => {
    return {
        type: actionTypes.SET_SIGNIN,
        bool: bool
    }
}

export const setUser = (user) => {
    return {
        type: actionTypes.SET_USER,
        user:  user
    }
}