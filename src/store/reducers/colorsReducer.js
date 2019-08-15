import { SET_COLORS } from "../types";

const INITIAL_STATE = {
    primary: "#4c3c4c",
    secondary: "#eee",
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_COLORS:
            return action.payload
        default:
            return state;
    }
}