import { SET_CURRENT_CHANNEL, SET_PRIVATE_CHANNEL, SET_USER_POSTS } from "../types";

const INITIAL_STATE = {
    channel: null,
    isPrivate: false,
    userPosts: null
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_CURRENT_CHANNEL:
            return {
                ...state, 
                channel: action.payload
            }
        case SET_PRIVATE_CHANNEL:
            return {
                ...state,
                isPrivate: action.payload
            }
        case SET_USER_POSTS:
            return {
                ...state, 
                userPosts: action.payload
            }
        default:
            return state
    }
}