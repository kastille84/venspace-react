import * as actionTypes from '../actions/actionTypes';

const initialState = {
    flyerMade: false,
    flyers: [],
    selectedFlyer: null
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.SET_FLYER_MADE:
            return {
                ...state,
                flyerMade: action.bool
            };
        case actionTypes.SET_FLYERS:
            return {
                ...state,
                flyers: action.flyers
            };
        case actionTypes.SET_SELECTED_FLYER:
            return {
                ...state,
                selectedFlyer: action.flyer
            };
        default:
            return state;
    }
}

export default reducer;