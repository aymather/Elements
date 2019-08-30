import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import retreatReducer from './retreatReducer';
import clientReducer from './clientReducer';
import groupReducer from './groupReducer';

export default combineReducers({
    user: authReducer,
    error: errorReducer,
    retreats: retreatReducer,
    clients: clientReducer,
    groups: groupReducer
})