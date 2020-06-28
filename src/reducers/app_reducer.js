import { combineReducers } from 'redux'
import authReducer from './auth_reducer'

const appReducer = combineReducers({
    authReducer
});

export default appReducer;