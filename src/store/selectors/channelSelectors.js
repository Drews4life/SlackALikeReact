import { createSelector } from 'reselect'

const selectChannelContainer = state => state.channelContainer

export const selectChannel = createSelector(
    [selectChannelContainer],
    container => container.channel
)

export const selectIsPrivate = createSelector(
    [selectChannelContainer],
    container => container.isPrivate
)

export const selectUserPosts = createSelector(
    [selectChannelContainer],
    container => container.userPosts
)