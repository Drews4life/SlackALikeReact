import { SET_COLORS } from "../types";


export const setColors = (primary, secondary) => ({
    type: SET_COLORS,
    payload: {primary, secondary}
})