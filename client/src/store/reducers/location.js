import * as actionTypes from '../actions/actionTypes';

const initialState = {
    ipLocation: null
}

const reducer = (state = initialState, action) => {
    //let cState = {...state};
    switch(action.type) {
        case actionTypes.SET_IP_LOCATION:
            return {
                ...state,
                ipLocation: action.ipLocation
            };
        default:
            return state;
    }
}

export default reducer;