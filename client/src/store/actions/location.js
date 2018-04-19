import * as actionTypes from './actionTypes';

export const setZip = (zip) => {
    return {
        type: actionTypes.SET_ZIP,
        zip: zip
    }
}