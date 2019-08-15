import { combineReducers } from 'redux'
import userReducer from './userReducer'
import channelReducer from './channelReducer'
import colorsReducer from './colorsReducer'

export default combineReducers({
    userContainer: userReducer,
    channelContainer: channelReducer,
    colorsContainer: colorsReducer
})