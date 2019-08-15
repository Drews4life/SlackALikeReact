import { SET_CURRENT_CHANNEL, SET_PRIVATE_CHANNEL, SET_USER_POSTS } from "../types";


export const setCurrentChannel = channel => ({
    type: SET_CURRENT_CHANNEL,
    payload: channel
})

export const setPrivateChannel = isPrivate => ({
    type: SET_PRIVATE_CHANNEL,
    payload: isPrivate
})

export const setUserPosts = posts => ({
    type: SET_USER_POSTS,
    payload: posts
})