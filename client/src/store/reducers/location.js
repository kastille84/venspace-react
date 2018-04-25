import * as actionTypes from '../actions/actionTypes';

const initialState = {
    ipLocation: null,
    validPlace: null,
    selectedPlace: null,
}

const reducer = (state = initialState, action) => {
    //let cState = {...state};
    switch(action.type) {
        case actionTypes.SET_IP_LOCATION:
            return {
                ...state,
                ipLocation: action.ipLocation
            };
        case actionTypes.SET_VALID_PLACE:
            return {
                ...state,
                validPlace: action.bool
            }
        case actionTypes.SET_SELECTED_PLACE:
            return {
                ...state,
                selectedPlace: action.place
            }
        default:
            return state;
    }
}

export default reducer;