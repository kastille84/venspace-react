import * as actionTypes from '../actions/actionTypes';

const initialState = {
    flyerMade: false,
    flyers: [],
    selectedFlyer: null,
    deletedFlyer: false
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
        case actionTypes.REMOVE_FLYER:
            let flyersC = [...state.flyers];
            let newFlyersA = flyersC.filter(flyer => {
                if (flyer._id === action.flyerId) {
                    return false
                }
                return true;
            });
            return {
                ...state,
                flyers: newFlyersA
            };
        case actionTypes.SET_DELETED_FLYER:
            return {
                ...state,
                deletedFlyer: action.bool
            };
        default:
            return state;
    }
}

export default reducer;