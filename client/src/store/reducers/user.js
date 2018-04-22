import * as actionTypes from '../actions/actionTypes';

const initialState = {
    user: null,
    registered: false
}

const reducer = (state = initialState, action) => {
    const cState = {...state};
    switch(action.type) {
        case actionTypes.SET_REGISTERED:
            return {
                ...state,
                registered: true
            }
        default: 
            return state;
    }
}

export default reducer;