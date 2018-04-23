import * as actionTypes from '../actions/actionTypes';

const initialState = {
    user: null,
    registered: false,
    signedIn: false
}

const reducer = (state = initialState, action) => {
    const cState = {...state};
    switch(action.type) {
        case actionTypes.SET_REGISTERED:
            return {
                ...state,
                registered: action.bool
            };
        case actionTypes.SET_SIGNIN:
            return {
                ...state,
                signedIn: action.bool
            };
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user
            };
        default: 
            return state;
    }
}

export default reducer;