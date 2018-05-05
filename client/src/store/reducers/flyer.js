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
        case actionTypes.SET_NEW_FLYER:
            let flyersCopy = [...state.flyers];
            let newFlyersArr = flyersCopy.map(flyer => {
                if (flyer._id === action.newFlyer._id) {
                    return action.newFlyer;
                }
                return flyer;
            });
            return {
                ...state,
                flyers: newFlyersArr
            };
        default:
            return state;
    }
}

export default reducer;