import * as actionTypes from '../actions/actionTypes';

const initialState = {
    zip: null
}

const reducer = (state = initialState, action) => {
    //let cState = {...state};
    switch(action.type) {
        case actionTypes.SET_ZIP:
            return {
                ...state,
                zip: action.zip
            };
        default:
            return state
    }
}

export default reducer;