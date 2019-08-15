import { createSelector } from 'reselect'

const selectUserContainer = state => state.userContainer

export const selectUser = createSelector(
    [selectUserContainer],
    container => container.user
)

export const selectIsLoadingUser = createSelector(
    [selectUserContainer],
    container => container.isLoading
)