import { SET_USER, CLEAR_USER } from "../types";

const INITIAL_STATE = {
    user: null,
    isLoading: true
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state, 
                user: action.payload,
                isLoading: false
            }
        case CLEAR_USER:
            return {
                ...state, 
                user: null, 
                isLoading: false
            }
        default:
            return state
    }
}