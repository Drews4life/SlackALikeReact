import { createSelector } from 'reselect'

const selectColorsContainer = state => state.colorsContainer

export const selectPrimaryColor = createSelector(
    [selectColorsContainer],
    container => container.primary
)

export const selectSecondaryColor = createSelector(
    [selectColorsContainer],
    container => container.secondary
)